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
                "kind": "arg",
                "path": "fileHash"
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
    },
    {
      "name": "verifyMusic",
      "discriminator": [
        220,
        188,
        83,
        190,
        12,
        244,
        75,
        59
      ],
      "accounts": [
        {
          "name": "rhythmChain",
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "fileHash"
              }
            ]
          }
        }
      ],
      "args": [
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
  "events": [
    {
      "name": "musicVerified",
      "discriminator": [
        38,
        205,
        164,
        181,
        15,
        20,
        251,
        135
      ]
    }
  ],
  "types": [
    {
      "name": "musicVerified",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "hash",
            "type": "string"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "isAuthentic",
            "type": "bool"
          },
          {
            "name": "fileName",
            "type": "string"
          },
          {
            "name": "fileAuthor",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "rhythmChain",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
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
