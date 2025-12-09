import licenseHeaderModule from "./rules/license-header.cjs";
import noBooleanParametersModule from "./rules/no-boolean-parameters.cjs";
import noRestrictedImportsModule from "./rules/no-restricted-imports.cjs";
import noReturnPromiseResolveModule from "./rules/no-return-promise-resolve.cjs";
import preferHashPrivateModule from "./rules/prefer-hash-private.cjs";
import strictEqualityModule from "./rules/strict-equality.cjs";

export default {
  rules: {
    "license-header": licenseHeaderModule.default || licenseHeaderModule,
    "strict-equality": strictEqualityModule.default || strictEqualityModule,
    "no-return-promise-resolve": noReturnPromiseResolveModule.default || noReturnPromiseResolveModule,
    "no-boolean-parameters": noBooleanParametersModule.default || noBooleanParametersModule,
    "no-restricted-imports": noRestrictedImportsModule.default || noRestrictedImportsModule,
    "prefer-hash-private": preferHashPrivateModule.default || preferHashPrivateModule,
  },
};
