const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    // defino el modelo
    sequelize.define('users', {
        name :{
            type: DataTypes.STRING,
            unique:false,
            allowNull: true
            },
        email :{
            type: DataTypes.STRING,
            unique: true,
            allowNull: true,
            validate: { isEmail: true }
            },
        usertype: {
                type: DataTypes.STRING,
                 allowNull: true
            },
        adress :{
            type: DataTypes.STRING,
             allowNull: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false       
         },
         isLogged: {
             type: DataTypes.BOOLEAN
         }
    }, {
        timestamps: false
    });
  };