// SPDX-FileCopyrightText: Copyright (C) 2023-2024 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: MIT

import { RuleTester } from "@typescript-eslint/rule-tester";
import { TSESLint } from "@typescript-eslint/utils";

// should be the same of LICENSE_HEADER defined on license-header.js file.
const LICENSE_TYPE = "MPL-2.0";
const noLicense = "";
const LICENSE_HEADER = `
// SPDX-FileCopyrightText: Copyright (C) 2023-2024 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: ${LICENSE_TYPE}
`.trim();

const rule =
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require("./license-header") as TSESLint.RuleModule<
    "missingLicenseError" | "missingTypeOfLicense",
    Array<Record<string, string>>
  >;

const ruleTester = new RuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    project: "./tsconfig.test.json",
  },
});

const validLichtblickHeader = `
// SPDX-FileCopyrightText: Copyright (C) 2023-2024 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: ${LICENSE_TYPE}

// Rest of file
`;

const validLichtblickHeaderWithSpaces = `



// SPDX-FileCopyrightText: Copyright (C) 2023-2024 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: ${LICENSE_TYPE}



`;

const validLichtblickHeaderWithSpacesWithJsdom = `
/** @jest-environment jsdom */

// SPDX-FileCopyrightText: Copyright (C) 2023-2024 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: ${LICENSE_TYPE}
`;

const invalidLichtblickHeaderEmpty = `

`;

const invalidLichtblickHeaderOlder = `
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
`;

const invalidLichtblickHeaderRandom = `
var a = 1
var b = 2
console.log(1 + 2)
`;

const invalidLichtblickHeaderWithMissingTypeOfLicense = `
// SPDX-FileCopyrightText: Copyright (C) 2023-2024 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: ${noLicense}

`;

ruleTester.run("check-license-header", rule, {
  valid: [
    {
      code: validLichtblickHeader,
      options: [{ licenseType: "MPL-2.0" }],
    },
    {
      code: validLichtblickHeaderWithSpaces,
      options: [{ licenseType: "MPL-2.0" }],
    },
    {
      code: validLichtblickHeaderWithSpacesWithJsdom,
      options: [{ licenseType: "MPL-2.0" }],
    },
  ],

  // Test if the lint fix were successfull, adding the LICENSE_HEADER followed by two empty lines
  invalid: [
    {
      code: invalidLichtblickHeaderEmpty,
      options: [{ licenseType: "MPL-2.0" }],
      errors: [{ messageId: "missingLicenseError" }],
      output: LICENSE_HEADER + "\n\n" + invalidLichtblickHeaderEmpty,
    },
    {
      code: invalidLichtblickHeaderOlder,
      options: [{ licenseType: "MPL-2.0" }],
      errors: [{ messageId: "missingLicenseError" }],
      output: LICENSE_HEADER + "\n\n" + invalidLichtblickHeaderOlder,
    },
    {
      code: invalidLichtblickHeaderRandom,
      options: [{ licenseType: "MPL-2.0" }],
      errors: [{ messageId: "missingLicenseError" }],
      output: LICENSE_HEADER + "\n\n" + invalidLichtblickHeaderRandom,
    },
    {
      code: invalidLichtblickHeaderWithMissingTypeOfLicense,
      options: [],
      errors: [{ messageId: "missingTypeOfLicense" }],
    },
  ],
});
