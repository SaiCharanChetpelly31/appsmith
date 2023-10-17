package com.appsmith.server.services;

import com.appsmith.server.configurations.AirgapInstanceConfig;
import com.appsmith.server.constants.MigrationStatus;
import com.appsmith.server.domains.License;
import com.appsmith.server.domains.Tenant;
import com.appsmith.server.domains.TenantConfiguration;
import com.appsmith.server.helpers.CollectionUtils;
import com.appsmith.server.helpers.FeatureFlagMigrationHelper;
import com.appsmith.server.services.ce.FeatureFlagServiceCEImpl;
import org.ff4j.FF4j;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

import static java.lang.Boolean.TRUE;

@Component
public class FeatureFlagServiceImpl extends FeatureFlagServiceCEImpl implements FeatureFlagService {

    private final AirgapInstanceConfig airgapInstanceConfig;
    private final TenantService tenantService;

    public FeatureFlagServiceImpl(
            SessionUserService sessionUserService,
            FF4j ff4j,
            TenantService tenantService,
            UserIdentifierService userIdentifierService,
            CacheableFeatureFlagHelper cacheableFeatureFlagHelper,
            FeatureFlagMigrationHelper featureFlagMigrationHelper,
            AirgapInstanceConfig airgapInstanceConfig) {
        super(
                sessionUserService,
                ff4j,
                tenantService,
                userIdentifierService,
                cacheableFeatureFlagHelper,
                featureFlagMigrationHelper);
        this.airgapInstanceConfig = airgapInstanceConfig;
        this.tenantService = tenantService;
    }

    @Override
    public Mono<Map<String, Boolean>> getAllFeatureFlagsForUser() {
        if (!airgapInstanceConfig.isAirgapEnabled()) {
            return super.getAllFeatureFlagsForUser();
        }
        // For airgap, we need to fetch the feature flags for the tenant only as user level flags needs third party call
        // to CS, but tenant flags are embedded into the license key itself
        return getTenantFeatures().switchIfEmpty(Mono.just(new HashMap<>()));
    }

    /**
     * Method to execute migrations for feature flags only if the plan has not changed otherwise the migrations are
     * gated via user action which is via:
     * 1. update license
     * 2. remove license
     *
     * @param tenant    tenant for which the migrations need to be executed
     * @return          tenant with migrations executed
     */
    @Override
    public Mono<Tenant> checkAndExecuteMigrationsForTenantFeatureFlags(Tenant tenant) {
        if (tenant.getTenantConfiguration() == null
                || tenant.getTenantConfiguration().getLicense() == null) {
            return Mono.just(tenant);
        }
        TenantConfiguration tenantConfiguration = tenant.getTenantConfiguration();
        License license = tenantConfiguration.getLicense();

        Mono<Tenant> tenantMono = super.checkAndExecuteMigrationsForTenantFeatureFlags(tenant);
        // If the plan has changed or the license is not active (expired) then set the migration status to pending as
        // the execute migration is gated via user action
        if (!CollectionUtils.isNullOrEmpty(tenantConfiguration.getFeaturesWithPendingMigration())
                && (!license.getPlan().equals(license.getPreviousPlan()) || !TRUE.equals(license.getActive()))) {
            tenantConfiguration.setMigrationStatus(MigrationStatus.PENDING);
            tenantMono = tenantService.save(tenant);
        }
        return tenantMono;
    }
}
