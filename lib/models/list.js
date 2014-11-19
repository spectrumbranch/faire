module.exports = function(sequelize, DataTypes) {
    var List = sequelize.define("List", {
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
    return List;
};
