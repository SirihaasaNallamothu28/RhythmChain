/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/rhythmChain.json`.
 */
export type RhythmChain = {
  "address": "coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF",
  "metadata": {
    "name": "rhythmChain",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "rhythmChain",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  104,
                  121,
                  116,
                  104,
                  109,
                  67,
                  104,
                  97,
                  105,
                  110
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "fileName",
          "type": "string"
        },
        {
          "name": "fileAuthor",
          "type": "string"
        },
        {
          "name": "fileTimestamp",
          "type": "u64"
        },
        {
          "name": "fileLength",
          "type": "u64"
        },
        {
          "name": "fileHash",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "rhythmChain",
      "discriminator": [
        231,
        223,
        187,
        25,
        11,
        73,
        65,
        26
      ]
    }
  ],
  "types": [
    {
      "name": "rhythmChain",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "fileHash",
            "type": "string"
          },
          {
            "name": "fileName",
            "type": "string"
          },
          {
            "name": "fileAuthor",
            "type": "string"
          },
          {
            "name": "fileTimestamp",
            "type": "u64"
          },
          {
            "name": "fileLength",
            "type": "u64"
          }
        ]
      }
    }
  ]
};
