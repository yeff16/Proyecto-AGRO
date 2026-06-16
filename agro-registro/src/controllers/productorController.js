const Productor = require("../models/Productor");
const Marca = require("../models/Marca");
const Geografia = require("../models/Geografia");
const db = require("../config/db");
const fs = require("fs");
const path = require("path");
const {
  obtenerHashImagen,
  calcularDistancia,
} = require("../utils/imageHasher");

const productorController = {
  listar: async (req, res) => {
    try {
      const { estatus, error, success } = req.query;
      const productores = await Productor.obtenerTodos(estatus);
      res.render("index", {
        productores,
        estatusActual: estatus || "",
        error,
        success,
      });
    } catch (error) {
      res.status(500).send("Error en el servidor");
    }
  },
  vistaRegistrar: async (req, res) => {
    try {
      const estados = await Geografia.obtenerEstados();
      res.render("registrar", { estados, error: req.query.error || null });
    } catch (error) {
      res.status(500).send("Error al cargar formulario");
    }
  },
  registrar: async (req, res) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      const {
        cedula,
        nombres,
        apellidos,
        id_parroquia,
        nombre_finca,
        sector,
        coordenadas,
        marca_canvas,
      } = req.body;

      const existeCedula = await Productor.verificarCedula(cedula);
      if (existeCedula) {
        throw new Error("La cédula ya está registrada en el sistema.");
      }

      if (!marca_canvas) {
        throw new Error(
          "Debe ingresar un dibujo o cargar una imagen para el hierro.",
        );
      }

      const nombreArchivo = `marca_${Date.now()}.png`;
      const rutaGuardado = path.join(
        __dirname,
        "../../public/uploads",
        nombreArchivo,
      );

      const base64Data = marca_canvas.replace(/^data:image\/\w+;base64,/, "");

      const imageBuffer = Buffer.from(base64Data, "base64");
      fs.writeFileSync(rutaGuardado, imageBuffer);

      const nuevoHash = await obtenerHashImagen(rutaGuardado);
      const marcasExistentes = await Marca.obtenerTodas();

      const UMBRAL_SIMILITUD = 12;
      for (const marca of marcasExistentes) {
        const distancia = calcularDistancia(nuevoHash, marca.hash_perceptual);
        if (distancia <= UMBRAL_SIMILITUD) {
          if (fs.existsSync(rutaGuardado)) fs.unlinkSync(rutaGuardado);
          throw new Error(
            "La marca ingresada presenta demasiadascoincidencias o patrones similares con una ya registrada.",
          );
        }
      }

      const idProductor = await Productor.crear(
        { cedula, nombres, apellidos },
        connection,
      );

      await Productor.agregarPredio(
        {
          id_productor: idProductor,
          id_parroquia,
          nombre_finca,
          sector,
          coordenadas,
        },
        connection,
      );

      const urlPublica = `/uploads/${nombreArchivo}`;
      await Marca.crear(idProductor, urlPublica, nuevoHash, connection);

      await connection.commit();
      res.redirect("/?success=Productor+y+hierro+registrados+exitosamente.");
    } catch (error) {
      await connection.rollback();

      console.error("❌ Detalle interno del fallo:", error.message || error);

      res.redirect(`/registrar?error=${encodeURIComponent(error.message)}`);
    } finally {
      connection.release();
    }
  },
  cambiarEstatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { estatus } = req.body;
      await Productor.cambiarEstatus(id, estatus);
      res.redirect("/?success=Estatus+actualizado+correctamente.");
    } catch (error) {
      res.redirect("/?error=Error+al+cambiar+el+estatus.");
    }
  },
};

module.exports = productorController;
