module.exports = function(sequelize, DataTypes) {
    var Task = sequelize.define("Task", {
        name: {
            type: DataTypes.String(50)
        },
        status: {
            type: DataTypes.ENUM,
            values: ['active', 'inactive', 'deleted']
        }
    }, {
        freezeTableName: true
    });
    return Task;
};
