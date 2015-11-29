module.exports = function(sequelize, DataTypes) {
    var preference = sequelize.define("preference", {
        theme: {
            type: DataTypes.STRING(30)
        }
    }, {
        freezeTableName: true
    });
    return preference;
};
