package com.appsmith.server.repositories;

import com.appsmith.external.models.BaseDomain;
import com.appsmith.server.acl.AclPermission;
import com.appsmith.server.helpers.ce.bridge.Update;
import com.appsmith.server.repositories.ce.params.QueryAllParams;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface AppsmithRepository<T extends BaseDomain> {

    Optional<T> findById(String id, AclPermission permission);

    Optional<T> findById(String id, List<String> projectionFieldNames, AclPermission permission);

    Optional<T> updateById(String id, T resource, AclPermission permission);

    /*no-cake*/ QueryAllParams<T> queryBuilder();

    T setUserPermissionsInObject(T obj, Collection<String> permissionGroups);

    T setUserPermissionsInObject(T obj);

    T updateAndReturn(String id, Update updateObj, Optional<AclPermission> permission);

    /**
     * This method uses the mongodb bulk operation to save a list of new actions. When calling this method, please note
     * the following points:
     * 1. All of them will be written to database in a single DB operation.
     * 2. If you pass a domain without ID, the ID will be generated by the database.
     * 3. All the auto generated fields e.g. createdAt, updatedAt should be set by the caller.
     *    They'll not be generated in the bulk write.
     * 4. No constraint validation will be performed on the new actions.
     * @param domainList List of domains that'll be saved in bulk
     * @return List of actions that were passed in the method
     */
    Optional<Void> bulkInsert(BaseRepository<T, String> baseRepository, List<T> domainList);

    Optional<Void> bulkUpdate(BaseRepository<T, String> baseRepository, List<T> domainList);
}
