// A custom eslint rule checking for the existence of an MPL license header,
// while allowing certain prefixes that cannot be moved below the license header.

const ALLOWED_PREFIX_LINES = ["/** @jest-environment jsdom */"];

module.exports = {
  meta: {
    type: "suggestion",
    fixable: "code",
    schema: [
      {
        type: "object",
        properties: {
          licenseType: {
            type: "string",
            descritpion:
              "Type of license that should be displayed on the header.",
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      wrongHeaderError:
        "There is an error with the file header. Please check if the header exists or if there is a mistake in it.",
      missingTypeOfLicenseError:
        "Please specify the type of license in the .eslintrc.yaml configuration.",
      wrongTypeOfLicenseError:
        "There is a mismatch between the license type specified in .eslintrc.yaml and the license in the file header.",
    },
  },

  create: (context) => {
    const options = context.options[0];
    if (!options || !options.licenseType) {
      context.report({
        loc: { line: 0, column: 0 },
        messageId: "missingTypeOfLicenseError",
      });
      return {};
    }
    const LICENSE_TYPE = options.licenseType;
    const LICENSE_HEADER = `
// SPDX-FileCopyrightText: Copyright (C) 2023-2024 Bayerische Motoren Werke Aktiengesellschaft (BMW AG)<lichtblick@bmwgroup.com>
// SPDX-License-Identifier: ${LICENSE_TYPE}
    `.trim();

    return {
      Program: () => {
        const source = context.getSourceCode().getText();
        const headerIndex = source.indexOf(LICENSE_HEADER);
        const prefixLines = source.substring(0, headerIndex).trim().split("\n");
        const prefixLinesAreValid = prefixLines.every(
          (line) => line === "" || ALLOWED_PREFIX_LINES.includes(line)
        );
        const licenseLine = "SPDX-License-Identifier:";
        const startIndex = source.indexOf(licenseLine);
        let licenseOnHeader;
        let licenseIdentifierIndex;
        let endIndex;
        if (startIndex !== -1) {
          licenseIdentifierIndex = startIndex + licenseLine.length;
          endIndex = source.indexOf("\n", licenseIdentifierIndex);
          licenseOnHeader = source
            .substring(licenseIdentifierIndex, endIndex)
            .trim();
        }
        if (headerIndex === -1 || !prefixLinesAreValid) {
          context.report({
            messageId: "wrongHeaderError",
            loc: { start: 0, end: +source.indexOf("\n") + 1 },
            fix: () => {
              return { range: [0, 0], text: LICENSE_HEADER + "\n\n" };
            },
          });
        } else if (licenseOnHeader !== LICENSE_TYPE) {
          console.log("licenseIdentifierIndex", licenseIdentifierIndex);
          console.log("endIndex", endIndex);
          context.report({
            messageId: "wrongTypeOfLicenseError",
            loc: { start: licenseIdentifierIndex, end: endIndex },
            fix: (fixer) => {
              return fixer.replaceTextRange(
                [licenseIdentifierIndex, endIndex],
                ` ${LICENSE_TYPE}`
              );
            },
          });
        }
      },
    };
  },
};
