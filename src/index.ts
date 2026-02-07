import 'dotenv/config'
import express from 'express'
import sequelize from './bd/index'
import Product from './models/product'
import { error } from 'node:console'

const app = express()
const PORT = process.env.PORT || 3005

app.use(express.json())

//CREACION DE PRODCUTOS
app.post('/producto', async (req, res) => {
  try {

    const { nombre, descripcion, precio } = req.body;

    if (!nombre || !descripcion || !precio) {
      res.status(400).json({ error: 'El campo es obligatorio' });
      return;
    }

    const nuevoUsuario = await Product.create({
      nombre,
      descripcion,
      precio
    });

    console.log('Producto creado:', nuevoUsuario.toJSON());
    res.status(201).json(nuevoUsuario);

  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Hubo un error al guardar el usuario' });
  }
});


//OBTENER TODOS LOS PRODUCTOS

app.get('/producto', async (req, res) => {
  try {
    const allProduct = await Product.findAll()
    res.status(200).json(allProduct)
  }
  catch (error) {

    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
})

//OBTENER SOLO UN PRODUCTO

app.get("/producto/:productoId", async (req, res) => {
  try {

    const { nombre } = req.body
    const oneProduct = await Product.findOne(nombre)
    res.status(200).json(oneProduct)
  }

  catch (error) {
    console.log("Error:", error);
    res.status(400).json({ error: "Error" })

  }

})

// PATCH /products/:productId — modificar un producto
app.patch('/products/:productId', async (req, res) => {
  try {
    const { productId } = req.params
    const { nombre, descripcion, precio } = req.body

    const product = await Product.findByPk(productId)
    if (!product) {
      res.status(404).json({ error: 'Producto no encontrado' })
      return
    }

    const updates: { nombre?: string; descripcion?: string; precio?: number } = {}
    if (nombre !== undefined) updates.nombre = nombre
    if (descripcion !== undefined) updates.descripcion = descripcion
    if (precio !== undefined) updates.precio = precio

    await product.update(updates)
    res.status(200).json(product)
  } catch (error) {
    console.error('Error al actualizar producto:', error)
    res.status(500).json({ error: 'Error al actualizar el producto' })
  }
})

// DELETE /products/:productId — eliminar un producto
app.delete('/products/:productId', async (req, res) => {
  try {
    const { productId } = req.params
    const product = await Product.findByPk(productId)
    if (!product) {
      res.status(404).json({ error: 'Producto no encontrado' })
      return
    }
    await product.destroy()
    res.status(200).json({ message: 'Producto eliminado correctamente' })
  } catch (error) {
    console.error('Error al eliminar producto:', error)
    res.status(500).json({ error: 'Error al eliminar el producto' })
  }
})


const startServer = async () => {
  try {
    await sequelize.sync()
    await sequelize.authenticate();
    console.log('✅ Base de datos conectada correctamente');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor Express corriendo en http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Error fatal: No se pudo conectar la BD ni iniciar el servidor:', error);
  }
};

startServer();

