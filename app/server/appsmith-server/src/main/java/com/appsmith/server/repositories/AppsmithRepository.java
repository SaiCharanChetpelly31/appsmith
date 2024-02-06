package com.appsmith.server.repositories;

import com.appsmith.external.models.BaseDomain;
import com.appsmith.server.acl.AclPermission;
import com.appsmith.server.repositories.ce.params.QueryAllParams;
import com.mongodb.bulk.BulkWriteResult;
import com.mongodb.client.result.InsertManyResult;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Update;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface AppsmithRepository<T extends BaseDomain> {

    Mono<T> findById(String id, AclPermission permission);

    Mono<T> findById(String id, Optional<AclPermission> permission);

    Mono<T> findById(String id, List<String> projectionFieldNames, AclPermission permission);

    Mono<T> updateById(String id, T resource, AclPermission permission);

    QueryAllParams<T> queryBuilder();

    Flux<T> queryAllWithStrictPermissionGroups(
            List<Criteria> criterias,
            Optional<List<String>> includeFields,
            Optional<AclPermission> permission,
            Sort sort,
            int limit,
            int skip);

    Mono<T> setUserPermissionsInObject(T obj, Set<String> permissionGroups);

    Mono<T> setUserPermissionsInObject(T obj);

    Mono<T> updateAndReturn(String id, Update updateObj, Optional<AclPermission> permission);

    /**
     * This method uses the mongodb bulk operation to save a list of new actions. When calling this method, please note
     * the following points:
     * 1. All of them will be written to database in a single DB operation.
     * 2. The list of domains returned are same as the ones passed in the method.
     * 3. If you pass a domain without ID, the ID will be generated by the database but the returned action
     * will not have the ID.
     * 4. All the auto generated fields e.g. createdAt, updatedAt should be set by the caller.
     * They'll not be generated in the bulk write.
     * 5. No constraint validation will be performed on the new actions.
     * @param domainList List of domains that'll be saved in bulk
     * @return List of actions that were passed in the method
     */
    Mono<List<InsertManyResult>> bulkInsert(List<T> domainList);

    Mono<List<BulkWriteResult>> bulkUpdate(List<T> domainList);
}
