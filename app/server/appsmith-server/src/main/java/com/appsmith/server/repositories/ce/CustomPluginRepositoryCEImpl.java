package com.appsmith.server.repositories.ce;

import com.appsmith.server.domains.Plugin;
import com.appsmith.server.helpers.ce.bridge.Bridge;
import com.appsmith.server.repositories.BaseAppsmithRepositoryImpl;

import java.util.List;
import java.util.Set;

public class CustomPluginRepositoryCEImpl extends BaseAppsmithRepositoryImpl<Plugin>
        implements CustomPluginRepositoryCE {

    @Override
    public List<Plugin> findDefaultPluginIcons() {
        List<String> projections = List.of(Plugin.Fields.name, Plugin.Fields.packageName, Plugin.Fields.iconLocation);
        return queryBuilder()
                .criteria(Bridge.isTrue(Plugin.Fields.defaultInstall))
                .fields(projections)
                .all();
    }

    @Override
    public List<Plugin> findAllByIdsWithoutPermission(Set<String> ids, List<String> includeFields) {
        return queryBuilder()
                .criteria(Bridge.in(Plugin.Fields.id, ids))
                .fields(includeFields)
                .all();
    }
}
