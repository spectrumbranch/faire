module.exports = function(sequelize, DataTypes) {
    var task = sequelize.define("task", {
        name: {
            type: DataTypes.STRING(1000)
        },
        status: {
            type: DataTypes.ENUM,
            values: ['active', 'inactive', 'deleted'],
            defaultValue: 'active'
        }
    }, {
        freezeTableName: true
    });
    return task;
};
