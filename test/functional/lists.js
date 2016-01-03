var assert = require('assert');
var Faire;
var db;
var Fixtures;

module.exports = function(faire, DB, fixtures) {
    Faire = faire;
    db = DB;
    Fixtures = fixtures;
}

//Should consider a more efficient testing method.
describe('Faire.Lists API', function() {
    var user_id_1, user_id_2, user_id_3, user_id_4
    ,   email1, email2, email3, email4;
    beforeEach(function(done) {
        email1 = Fixtures.Lists.Users[0].email;
        var passwrd1 = Fixtures.Lists.Users[0].password;
        
        email2 = Fixtures.Lists.Users[1].email;
        var passwrd2 = Fixtures.Lists.Users[1].password;
        
        email3 = Fixtures.Lists.Users[2].email;
        var passwrd3 = Fixtures.Lists.Users[2].password;

        email4 = Fixtures.Lists.Users[3].email;
        var passwrd4 = Fixtures.Lists.Users[3].password;

        var virt_modules = [];
        virt_modules.push(Faire.Scurvy);

        
        db.init(virt_modules, function() {
            console.log('-------- database setup complete --------');
            Faire.Scurvy.createUser({email: email1, passwrd: passwrd1, status: 'active'}, function(err, userball1) {
                user_id_1 = userball1.user.id
                Faire.Scurvy.createUser({email: email2, passwrd: passwrd2, status: 'active'}, function(err, userball2) {
                    user_id_2 = userball2.user.id;
                    Faire.Scurvy.createUser({email: email3, passwrd: passwrd3, status: 'active'}, function(err, userball3) {
                        user_id_3 = userball3.user.id;
                        Faire.Scurvy.createUser({email: email4, passwrd: passwrd4, status: 'active'}, function(err, userball4) {
                            user_id_4 = userball4.user.id;
                            done();
                        });
                    });
                });
            });
        });
    })
    describe('#add()', function() {
        it('should return a list object with the given name with zero tasks after adding it to the database.', function(done) {
            var listName = 'This is a list.';
            Faire.Lists.add({ user: user_id_1, name: listName }, function(err, list) {
                assert(err == null);
                assert(list !== undefined);
                assert(list.id !== undefined);
                assert(list.name !== undefined && list.name === listName);
                assert(list.status !== undefined && list.status === 'active');
                assert(list.tasks !== undefined && list.tasks.length === 0);
                done();
            })
        })
        it('should return the list object with a nondefault status after adding it to the database.', function(done) {
            var listName = 'This is an example list1.';
            var status_inactive = 'inactive';
            Faire.Lists.add({ user: user_id_1, name: listName, status: status_inactive }, function(err, list) {
                assert(err == null);
                assert(list !== undefined);
                assert(list.id !== undefined);
                assert(list.name !== undefined && list.name === listName);
                assert(list.status !== undefined && list.status === status_inactive);
                done();
            })
        })
        it('should error out when required parameter "user" is missing.', function(done) {
            var listName = 'This is an example list2.';
            Faire.Lists.add({name: listName}, function(err, list) {
                assert(err instanceof Error);
                assert(list === undefined);
                done();
            })
        })
        it('should error out when required parameter "name" is missing.', function(done) {
            Faire.Lists.add({user: user_id_1}, function(err, list) {
                assert(err instanceof Error);
                assert(list === undefined);
                done();
            })
        })
    })
    
    describe('#activate()', function() {
        it('should return the activated list object after activating it in the database.', function(done) {
            var listName = 'This is an example list to make active.';
            var status_inactive = 'inactive';
            var status_active = 'active';
            Faire.Lists.add({ user: user_id_1, name: listName, status: status_inactive  }, function(err, list) {
                Faire.Lists.activate({ id: list.id, user: user_id_1}, function(err1, activatedList) {
                    assert(err1 == null);
                    assert.notStrictEqual(activatedList, undefined);
                    assert.notStrictEqual(activatedList.id, undefined);
                    assert.strictEqual(activatedList.id, list.id);
                    assert(activatedList.name !== undefined && activatedList.name === listName);
                    assert(activatedList.status !== undefined && activatedList.status === status_active);
                    done();
                })
            })
        })
        it('should error out when required parameters "user" and "id" are missing.', function(done) {
            var listName = 'This is an example list to test required input.';
            var status_inactive = 'inactive';
            Faire.Lists.add({ user: user_id_1, name: listName, status: status_inactive  }, function(err, list) {
                //missing both user and id
                Faire.Lists.activate({}, function(err1, activatedList1) {
                    assert(err1 instanceof Error);
                    assert(activatedList1 === undefined);
                    //missing user
                    Faire.Lists.activate({ id: list.id }, function(err2, activatedList2) {
                        assert(err2 instanceof Error);
                        assert(activatedList2 === undefined);
                        done();
                    })
                    
                })
            })
        })
    })
    
    describe('#inactivate()', function() {
        it('should return the inactivated list object after inactivating it in the database.', function(done) {
            var listName = 'This is an example list to inactive.';
            var status_inactive = 'inactive';
            Faire.Lists.add({ user: user_id_1, name: listName }, function(err, list) {
                Faire.Lists.inactivate({ id: list.id, user: user_id_1}, function(err1, inactivatedList) {
                    assert(err1 == null);
                    assert(inactivatedList !== undefined);
                    assert(inactivatedList.id !== undefined && inactivatedList.id === list.id);
                    assert(inactivatedList.name !== undefined && inactivatedList.name === listName);
                    assert(inactivatedList.status !== undefined && inactivatedList.status === status_inactive);
                    done();
                })
            })
        })
        it('should error out when required parameters "user" and "id" are missing.', function(done) {
            var listName = 'This is an example list to test required input.';
            var status_inactive = 'inactive';
            Faire.Lists.add({ user: user_id_1, name: listName  }, function(err, list) {
                //missing both user and id
                Faire.Lists.inactivate({}, function(err1, inactivatedList1) {
                    assert(err1 instanceof Error);
                    assert(inactivatedList1 === undefined);
                    //missing user
                    Faire.Lists.inactivate({ id: list.id }, function(err2, inactivatedList2) {
                        assert(err2 instanceof Error);
                        assert(inactivatedList2 === undefined);
                        done();
                    })
                    
                })
            })
        })
    })
    
    describe('#delete()', function() {
        it('should return the deleted list object after deleting it in the database.', function(done) {
            var listName = 'This is an example list to test delete.';
            var status_deleted = 'deleted';
            Faire.Lists.add({ user: user_id_1, name: listName }, function(err, list) {
                Faire.Lists.delete({ id: list.id, user: user_id_1}, function(err1, deletedList) {
                    assert(err1 == null);
                    assert(deletedList !== undefined);
                    assert(deletedList.id !== undefined && deletedList.id === list.id);
                    assert(deletedList.name !== undefined && deletedList.name === listName);
                    assert(deletedList.status !== undefined && deletedList.status === status_deleted);
                    done();
                })
            })
        })
        it('should error out when required parameters "user" and "id" are missing.', function(done) {
            var listName = 'example list for delete input requirements';
            var status_deleted = 'deleted';
            Faire.Lists.add({ user: user_id_1, name: listName  }, function(err, list) {
                //missing both user and id
                Faire.Lists.delete({}, function(err1, deletedList1) {
                    assert(err1 instanceof Error);
                    assert(deletedList1 === undefined);
                    //missing user
                    Faire.Lists.delete({ id: list.id }, function(err2, deletedList2) {
                        assert(err2 instanceof Error);
                        assert(deletedList2 === undefined);
                        done();
                    })
                    
                })
            })
        })
    })
    
    describe('#update()', function() {
        it('should return the updated list object after updating it in the database.', function(done) {
            var listName = 'This is an example list for update testing.';
            var updatedListName = 'This is list updated with a new name';
            Faire.Lists.add({ user: user_id_1, name: listName }, function(err, list) {
                Faire.Lists.update({ id: list.id, user: user_id_1, name: updatedListName }, function(err1, updatedList) {
                    assert(err1 == null);
                    assert(updatedList !== undefined);
                    assert(updatedList.id !== undefined && updatedList.id === list.id);
                    assert(updatedList.name !== undefined && updatedList.name === updatedListName);
                    assert(updatedList.status !== undefined);
                    done();
                })
            })
        })
        it('should error out when required parameters "user" and "id" are missing.', function(done) {
            var listName = 'example list for update input requirements';
            Faire.Lists.add({ user: user_id_1, name: listName  }, function(err, list) {
                //missing both user and id
                Faire.Lists.update({}, function(err1, updatedList1) {
                    assert(err1 instanceof Error);
                    assert(updatedList1 === undefined);
                    //missing user
                    Faire.Lists.update({ id: list.id }, function(err2, updatedList2) {
                        assert(err2 instanceof Error);
                        assert(updatedList2 === undefined);
                        done();
                    })
                    
                })
            })
        })
    })
    
    describe('#get()', function() {
        it('should return the list object keyed by the given id. if the list does not exist, return empty', function(done) {
            var listName = 'This is an example list to get.';
            Faire.Lists.add({ user: user_id_1, name: listName }, function(err, list) {
                Faire.Tasks.add({ user: user_id_1, list: list.id , name: 'nested task in list' }, function(err,task) {
                    Faire.Tasks.add({ user: user_id_1, list: list.id , name: 'another nested task in list' }, function(err,task2) {
                        Faire.Lists.share({ id: list.id , users: [user_id_2] }, function(err1, sharedUsers) {
                            Faire.Lists.get({ id: list.id, user: user_id_1 }, function(err1, getList) {
                                try {
                                    assert(err1 == null);
                                    assert(getList !== undefined);
                                    assert(getList.id !== undefined && getList.id === list.id);
                                    assert(getList.name !== undefined && getList.name === listName);
                                    assert(getList.owner.email !== undefined);
                                    assert(getList.owner.id === user_id_1);
                                    assert(getList.status !== undefined);
                                    assert(getList.updatedAt !== undefined);
                                    assert(getList.createdAt !== undefined);
                                    assert(getList.sharedUsers !== undefined && getList.sharedUsers.length === 1);

                                    assert(getList.sharedUsers[0].salt === undefined);
                                    assert(getList.sharedUsers[0].hash === undefined);
                                    assert(getList.sharedUsers[0].id === user_id_2);
                                    assert(getList.sharedUsers[0].email === email2);

                                    assert(getList.owner !== undefined);
                                    assert(getList.owner.email === email1);
                                    assert(getList.owner.id === user_id_1);
                                    assert(getList.owner.salt === undefined);
                                    assert(getList.owner.hash === undefined);

                                    assert(getList.tasks !== undefined && Array.isArray(getList.tasks));
                                } catch (e) {
                                    return done(e);
                                }
                                
                                
                                Faire.Lists.get({ id: 9999999, user: user_id_1 }, function(err2, getList2) {
                                    assert(err2 == null);
                                    assert(getList2 !== undefined);
                                    assert(getList2.id === undefined);
                                    done();
                                })
                            })
                        });
                    })
                })
                
            })
        })
        it('should error out when required parameters "user" and "id" are missing.', function(done) {
            var listName = 'example list for get input requirements';
            Faire.Lists.add({ user: user_id_1, name: listName  }, function(err, list) {
                //missing both user and id
                Faire.Lists.get({}, function(err1, getList1) {
                    assert(err1 instanceof Error);
                    assert(getList1 === undefined);
                    //missing user
                    Faire.Lists.get({ id: list.id }, function(err2, getList2) {
                        assert(err2 instanceof Error);
                        assert(getList2 === undefined);
                        done();
                    })
                    
                })
            })
        })
    })
    
    describe('#getAll()', function() {
        it('should return all non-deleted lists for a given user if no filters are applied. if there are no non-deleted lists for that user, return empty', function(done) {
            var listName = 'This is an example list to test getAll.';
            Faire.Lists.add({ user: user_id_1, name: listName }, function(err, list) {
                Faire.Lists.add({ user: user_id_1, name: listName, status: 'deleted' }, function(err, list2) {
                    Faire.Lists.share({ id: list.id , users: [user_id_2] }, function(err1, sharedUsers) {
                        Faire.Lists.getAll({ user: user_id_1 }, function(err1, getAllLists1) {
                            try {
                                assert(err1 == null);
                                assert(getAllLists1 !== undefined && Array.isArray(getAllLists1) && getAllLists1.length == 1);
                                assert(getAllLists1[0].id !== undefined);
                                assert(getAllLists1[0].name !== undefined);
                                assert(getAllLists1[0].status === 'active');
                                assert(getAllLists1[0].updatedAt !== undefined);
                                assert(getAllLists1[0].createdAt !== undefined);
                                assert(getAllLists1[0].tasks !== undefined && Array.isArray(getAllLists1[0].tasks));

                                var sharedList = undefined;
                                for (var i = 0; i < getAllLists1.length; i++) {
                                    if (getAllLists1[i].id == list.id) {
                                        sharedList = getAllLists1[i];
                                    }
                                }
                                assert(sharedList !== undefined);
                                assert(sharedList.sharedUsers !== undefined && sharedList.sharedUsers.length === 1);
                                assert(sharedList.sharedUsers[0].salt === undefined);
                                assert(sharedList.sharedUsers[0].hash === undefined);
                                assert(sharedList.sharedUsers[0].id === user_id_2);
                                assert(sharedList.sharedUsers[0].email === email2);

                                assert(sharedList.owner !== undefined);
                                assert(sharedList.owner.email === email1);
                                assert(sharedList.owner.id === user_id_1);
                                assert(sharedList.owner.salt === undefined);
                                assert(sharedList.owner.hash === undefined);
                            } catch(e) {
                                return done(e);
                            }
                            //User 4 has no lists
                            Faire.Lists.getAll({ user: user_id_4 }, function(err2, getAllLists2) {
                                assert(err2 == null);
                                assert(getAllLists2 !== undefined && Array.isArray(getAllLists2) && getAllLists2.length == 0);
                                assert(getAllLists2.id === undefined);
                                done();
                            })
                        })
                    })
                })
            })
        })
        it('should return deleted lists when the "includeDeleted" flag is true', function(done) {
            var activeListName = 'This is an active list to test getAll.';
            var deletedListName = 'This is a deleted list to test getAll.';
            Faire.Lists.add({ user: user_id_1, name: activeListName }, function(err, list) {
                Faire.Lists.add({ user: user_id_1, name: deletedListName, status: 'deleted' }, function(err, deletedList) {
                    Faire.Lists.getAll({ user: user_id_1, includeDeleted: true }, function(err1, getAllLists1) {
                        try {
                            assert(err1 == null);
                            assert(getAllLists1 !== undefined && Array.isArray(getAllLists1) && getAllLists1.length == 2);
                            
                            var foundDeletedList = null
                              , foundActiveList = null
                              ;
                              
                            for (var i = 0; i < getAllLists1.length; i++) {
                                if (getAllLists1[i].status == 'active') {
                                    foundActiveList = getAllLists1[i];
                                } else if (getAllLists1[i].status == 'deleted') {
                                    foundDeletedList = getAllLists1[i];
                                }
                            }
                            assert(foundDeletedList !== null);
                            assert(foundActiveList !== null);
                            
                            assert(foundDeletedList.id !== undefined);
                            assert(foundDeletedList.name === deletedListName);
                            assert(foundDeletedList.status === 'deleted');
                            assert(foundDeletedList.updatedAt !== undefined);
                            assert(foundDeletedList.createdAt !== undefined);
                            assert(foundDeletedList.tasks !== undefined && Array.isArray(foundDeletedList.tasks));
                            assert(foundDeletedList.sharedUsers !== undefined && Array.isArray(foundDeletedList.sharedUsers));
                            
                            assert(foundActiveList.id !== undefined);
                            assert(foundActiveList.name === activeListName);
                            assert(foundActiveList.status === 'active');
                            assert(foundActiveList.updatedAt !== undefined);
                            assert(foundActiveList.createdAt !== undefined);
                            assert(foundActiveList.tasks !== undefined && Array.isArray(foundActiveList.tasks));
                            assert(foundActiveList.sharedUsers !== undefined && Array.isArray(foundActiveList.sharedUsers));

                            assert(foundActiveList.owner !== undefined);
                            assert(foundActiveList.owner.email === email1);
                            assert(foundActiveList.owner.id === user_id_1);
                            assert(foundActiveList.owner.salt === undefined);
                            assert(foundActiveList.owner.hash === undefined);
                        } catch(e) {
                            return done(e);
                        }
                        //User 4 has no lists
                        Faire.Lists.getAll({ user: user_id_4 }, function(err2, getAllLists2) {
                            assert(err2 == null);
                            assert(getAllLists2 !== undefined && Array.isArray(getAllLists2) && getAllLists2.length == 0);
                            assert(getAllLists2.id === undefined);
                            done();
                        })
                    })
                })
            })
        })
        it('should error out when required parameter "user" is missing.', function(done) {
            var listName = 'example list for getAll input validation';
            Faire.Lists.getAll({ }, function(err1, getAllLists1) {
                assert(err1 instanceof Error);
                assert(getAllLists1 === undefined);
                done();
            })
        })
    })
    
    
    describe('#share()', function() {
        it('should let the owner of a list give access rights of that list to other users', function(done) {
            var listName = 'example list for share functionality';
            Faire.Lists.add({ user: user_id_1, name: listName }, function(err, list) {
                Faire.Lists.share({ id: list.id , users: [user_id_2] }, function(err1, sharedUsers) {
                    assert(err1 == null);
                    assert(sharedUsers !== undefined && Array.isArray(sharedUsers) && sharedUsers.length === 1);
                    assert(sharedUsers[0] === user_id_2);
                    done();
                });
            });
        })
        it('should error out when required parameters "users(as [])" and "id" are missing.', function(done) {
            var listName = 'example list for share input requirements';
            Faire.Lists.add({ user: user_id_1, name: listName  }, function(err, list) {
                //missing id
                Faire.Lists.share({ users: [user_id_1] }, function(err1, sharedUsers) {
                    assert(err1 instanceof Error);
                    assert(sharedUsers === undefined);
                    //missing users
                    Faire.Lists.share({ id: list.id }, function(err2, sharedUsers2) {
                        assert(err2 instanceof Error);
                        assert(sharedUsers2 === undefined);
                        done();
                    })
                    
                })
            })
        })
        
        //TODO: optional write permissions boolean
    })
    describe('#unshare()', function() {
        it('should let the owner of a list revoke access rights of that list to other users', function(done) {
            var listName = 'example list for unshare functionality';
            Faire.Lists.add({ user: user_id_1, name: listName }, function(err, list) {
                Faire.Lists.share({ id: list.id , users: [user_id_2] }, function(err1, sharedUsers) {
                    Faire.Lists.unshare({ id: list.id , users: [user_id_2] }, function(err2, unsharedUsers) {
                        assert(err2 == null);
                        assert(unsharedUsers !== undefined && Array.isArray(unsharedUsers) && unsharedUsers.length === 1);
                        assert(unsharedUsers[0] === user_id_2);
                        done();
                    });
                });
            });
        })
        it('should error out when required parameters "users(as [])" and "id" are missing.', function(done) {
            var listName = 'example list for share input requirements';
            Faire.Lists.add({ user: user_id_1, name: listName  }, function(err, list) {
                //missing id
                Faire.Lists.unshare({ users: [user_id_1] }, function(err1, sharedUsers) {
                    assert(err1 instanceof Error);
                    assert(sharedUsers === undefined);
                    //missing users
                    Faire.Lists.unshare({ id: list.id }, function(err2, sharedUsers2) {
                        assert(err2 instanceof Error);
                        assert(sharedUsers2 === undefined);
                        done();
                    })
                    
                })
            })
        })
    })
    
    describe('#isListVisible()', function() {
        it('should return true if the user is an owner of the list or is a shareduser of the list, else false', function(done) {
            var listName = 'This is an example list to test list visibility.';
            Faire.Lists.add({ user: user_id_1, name: listName  }, function(err, list) {
                //User 1 is the owner of the list
                Faire.Lists.isListVisible({ user: user_id_1, id: list.id }, function(errVisible, listIsVisible) {
                    assert(errVisible == null);
                    assert(listIsVisible);
                    
                    //User 3 has no lists shared with them
                    Faire.Lists.isListVisible({ user: user_id_3, id: list.id }, function(errVisible2, listIsVisible2) {
                        assert(errVisible == null);
                        assert(!listIsVisible2);
                        done();
                    })
                    //TODO: SharedUser
                })
            })
        })
        it('should error out when required parameters "user" and "list" are missing.', function(done) {
            var listName = 'example list for isListVisible input requirements';
            Faire.Lists.add({ user: user_id_1, name: listName  }, function(err, list) {
                //missing user
                Faire.Lists.isListVisible({ id: list.id }, function(err1, listIsVisible) {
                    assert(err1 instanceof Error);
                    assert(listIsVisible === undefined);
                    //missing list
                    Faire.Lists.isListVisible({ user: user_id_1 }, function(err2, listIsVisible2) {
                        assert(err2 instanceof Error);
                        assert(listIsVisible2 === undefined);
                        done();
                    })
                    
                })
            })
        })
    })
    
    describe('#getSharedUsers()', function() {
        it('should return an array of users that have the specified list shared with them', function(done) {
            var listName = 'This is an example list to test shared users.';
            Faire.Lists.add({ user: user_id_1, name: listName }, function(err, list) {
                //User 1 is the owner of the list, but isn't a shared user
                Faire.Lists.getSharedUsers({ id: list.id }, function(errShared, sharedUsers) {
                    assert(errShared == null);
                    assert(sharedUsers && Array.isArray(sharedUsers) && sharedUsers.length === 0);
                    Faire.Lists.share({ id: list.id, users: [user_id_2] }, function(sharedListErr, updatedSharedUsers) {
                        Faire.Lists.getSharedUsers({ id: list.id }, function(errShared2, sharedUsers2) {
                            assert(errShared2 == null);
                            assert(sharedUsers2 && Array.isArray(sharedUsers2) && sharedUsers2.length === 1);
                            assert(sharedUsers2[0].id == user_id_2);
                            done();
                        });
                    });
                });
            });
        })
        it('should error out when required parameter "id" is missing.', function(done) {
            var listName = 'example list for getSharedUsers input requirements';
            Faire.Lists.add({ user: user_id_1, name: listName  }, function(err, list) {
                //missing user
                Faire.Lists.getSharedUsers({ }, function(err1, sharedUsers) {
                    assert(err1 instanceof Error);
                    assert(sharedUsers === undefined);
                    done();
                })
            })
        })
    })
})