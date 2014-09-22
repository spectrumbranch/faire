module.exports = function(sequelize, DataTypes) {
    var SharedLists = sequelize.define("SharedLists", {
        write: {
            type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true
        }
    }, {
        freezeTableName: true
    });
    return SharedLists;
};
