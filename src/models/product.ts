import { DataTypes, Model } from 'sequelize';
import sequelize from '../bd/index';

class Product extends Model { }

Product.init({
  // Definición de columnas
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false
  },
  precio: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
},
 {
  sequelize,
  modelName: 'Productos',
  timestamps: true
});

export default Product;