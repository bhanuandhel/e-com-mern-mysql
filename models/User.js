const {DataTypes} = require('sequelize');
const sequelize = require('../utils/database');

const Users = sequelize.define("users", {
                        name:{
                            type: DataTypes.STRING
                        },
                        email:{
                            type: DataTypes.STRING,
                            allowNull: false,
                            unique:true
                        },
                         phone:{
                            type: DataTypes.STRING ,
                            allowNull: false,
                            unique:true
                        },
                        password:{
                            type: DataTypes.STRING
                        },
                        profilePic:{
                             type: DataTypes.STRING
                        },
                        role:{
                            type:   DataTypes.ENUM,
                            values: ['admin', 'employ', 'user']
                        },
                        resetPasswordToken:{
                            type: DataTypes.STRING
                        },
                        status:{
                            type: DataTypes.BOOLEAN,
                        }
                    });

module.exports = Users