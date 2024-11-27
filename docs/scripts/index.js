//Lunr search index
var index = {
  "index": {
    "version": "2.3.9",
    "fields": [
      "text"
    ],
    "fieldVectors": [
      [
        "text/Lunr",
        [
          0,
          1.136,
          1,
          1.136,
          2,
          1.136,
          3,
          1.136
        ]
      ],
      [
        "text/React",
        [
          4,
          0.504,
          5,
          0.504,
          6,
          1.053,
          7,
          1.053,
          8,
          1.053
        ]
      ],
      [
        "text/Lodash",
        [
          4,
          0.39,
          5,
          0.39,
          9,
          0.814,
          10,
          0.814,
          11,
          0.814,
          12,
          0.814,
          13,
          0.814,
          14,
          0.814,
          15,
          0.814
        ]
      ]
    ],
    "invertedIndex": [
      [
        "",
        {
          "_index": 14,
          "text": {
            "Lodash": {}
          }
        }
      ],
      [
        "bright",
        {
          "_index": 3,
          "text": {
            "Lunr": {}
          }
        }
      ],
      [
        "build",
        {
          "_index": 6,
          "text": {
            "React": {}
          }
        }
      ],
      [
        "deliv",
        {
          "_index": 11,
          "text": {
            "Lodash": {}
          }
        }
      ],
      [
        "extra",
        {
          "_index": 15,
          "text": {
            "Lodash": {}
          }
        }
      ],
      [
        "interfac",
        {
          "_index": 8,
          "text": {
            "React": {}
          }
        }
      ],
      [
        "javascript",
        {
          "_index": 4,
          "text": {
            "React": {},
            "Lodash": {}
          }
        }
      ],
      [
        "librari",
        {
          "_index": 5,
          "text": {
            "React": {},
            "Lodash": {}
          }
        }
      ],
      [
        "modern",
        {
          "_index": 9,
          "text": {
            "Lodash": {}
          }
        }
      ],
      [
        "modular",
        {
          "_index": 12,
          "text": {
            "Lodash": {}
          }
        }
      ],
      [
        "much",
        {
          "_index": 1,
          "text": {
            "Lunr": {}
          }
        }
      ],
      [
        "perform",
        {
          "_index": 13,
          "text": {
            "Lodash": {}
          }
        }
      ],
      [
        "smaller",
        {
          "_index": 2,
          "text": {
            "Lunr": {}
          }
        }
      ],
      [
        "solr",
        {
          "_index": 0,
          "text": {
            "Lunr": {}
          }
        }
      ],
      [
        "user",
        {
          "_index": 7,
          "text": {
            "React": {}
          }
        }
      ],
      [
        "util",
        {
          "_index": 10,
          "text": {
            "Lodash": {}
          }
        }
      ]
    ],
    "pipeline": [
      "stemmer"
    ]
  },
  "documents": {}
}

function getIndex(){ return index }

export default { getIndex };