module.exports = function(sequelize, DataTypes) {
    var sharedlists = sequelize.define("sharedlists", {
        write: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    }, {
        freezeTableName: true
    });
    return sharedlists;
};
