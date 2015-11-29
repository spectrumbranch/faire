module.exports = function(sequelize, DataTypes) {
    var list = sequelize.define("list", {
        name: {
            type: DataTypes.STRING(50)
        },
        status: {
            type: DataTypes.ENUM,
            values: ['active', 'inactive', 'deleted'],
            defaultValue: 'active'
        }
    }, {
        freezeTableName: true
    });
    return list;
};
