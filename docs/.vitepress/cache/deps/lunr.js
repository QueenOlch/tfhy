import {
  __commonJS
} from "./chunk-BUSYA2B4.js";

// node_modules/lunr/lunr.js
var require_lunr = __commonJS({
  "node_modules/lunr/lunr.js"(exports, module) {
    (function() {
      var lunr = function(config) {
        var builder = new lunr.Builder();
        builder.pipeline.add(
          lunr.trimmer,
          lunr.stopWordFilter,
          lunr.stemmer
        );
        builder.searchPipeline.add(
          lunr.stemmer
        );
        config.call(builder, builder);
        return builder.build();
      };
      lunr.version = "2.3.9";
      lunr.utils = {};
      lunr.utils.warn = /* @__PURE__ */ function(global) {
        return function(message) {
          if (global.console && console.warn) {
            console.warn(message);
          }
        };
      }(this);
      lunr.utils.asString = function(obj) {
        if (obj === void 0 || obj === null) {
          return "";
        } else {
          return obj.toString();
        }
      };
      lunr.utils.clone = function(obj) {
        if (obj === null || obj === void 0) {
          return obj;
        }
        var clone = /* @__PURE__ */ Object.create(null), keys = Object.keys(obj);
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i], val = obj[key];
          if (Array.isArray(val)) {
            clone[key] = val.slice();
            continue;
          }
          if (typeof val === "string" || typeof val === "number" || typeof val === "boolean") {
            clone[key] = val;
            continue;
          }
          throw new TypeError("clone is not deep and does not support nested objects");
        }
        return clone;
      };
      lunr.FieldRef = function(docRef, fieldName, stringValue) {
        this.docRef = docRef;
        this.fieldName = fieldName;
        this._stringValue = stringValue;
      };
      lunr.FieldRef.joiner = "/";
      lunr.FieldRef.fromString = function(s) {
        var n = s.indexOf(lunr.FieldRef.joiner);
        if (n === -1) {
          throw "malformed field ref string";
        }
        var fieldRef = s.slice(0, n), docRef = s.slice(n + 1);
        return new lunr.FieldRef(docRef, fieldRef, s);
      };
      lunr.FieldRef.prototype.toString = function() {
        if (this._stringValue == void 0) {
          this._stringValue = this.fieldName + lunr.FieldRef.joiner + this.docRef;
        }
        return this._stringValue;
      };
      lunr.Set = function(elements) {
        this.elements = /* @__PURE__ */ Object.create(null);
        if (elements) {
          this.length = elements.length;
          for (var i = 0; i < this.length; i++) {
            this.elements[elements[i]] = true;
          }
        } else {
          this.length = 0;
        }
      };
      lunr.Set.complete = {
        intersect: function(other) {
          return other;
        },
        union: function() {
          return this;
        },
        contains: function() {
          return true;
        }
      };
      lunr.Set.empty = {
        intersect: function() {
          return this;
        },
        union: function(other) {
          return other;
        },
        contains: function() {
          return false;
        }
      };
      lunr.Set.prototype.contains = function(object) {
        return !!this.elements[object];
      };
      lunr.Set.prototype.intersect = function(other) {
        var a, b, elements, intersection = [];
        if (other === lunr.Set.complete) {
          return this;
        }
        if (other === lunr.Set.empty) {
          return other;
        }
        if (this.length < other.length) {
          a = this;
          b = other;
        } else {
          a = other;
          b = this;
        }
        elements = Object.keys(a.elements);
        for (var i = 0; i < elements.length; i++) {
          var element = elements[i];
          if (element in b.elements) {
            intersection.push(element);
          }
        }
        return new lunr.Set(intersection);
      };
      lunr.Set.prototype.union = function(other) {
        if (other === lunr.Set.complete) {
          return lunr.Set.complete;
        }
        if (other === lunr.Set.empty) {
          return this;
        }
        return new lunr.Set(Object.keys(this.elements).concat(Object.keys(other.elements)));
      };
      lunr.idf = function(posting, documentCount) {
        var documentsWithTerm = 0;
        for (var fieldName in posting) {
          if (fieldName == "_index") continue;
          documentsWithTerm += Object.keys(posting[fieldName]).length;
        }
        var x = (documentCount - documentsWithTerm + 0.5) / (documentsWithTerm + 0.5);
        return Math.log(1 + Math.abs(x));
      };
      lunr.Token = function(str, metadata) {
        this.str = str || "";
        this.metadata = metadata || {};
      };
      lunr.Token.prototype.toString = function() {
        return this.str;
      };
      lunr.Token.prototype.update = function(fn) {
        this.str = fn(this.str, this.metadata);
        return this;
      };
      lunr.Token.prototype.clone = function(fn) {
        fn = fn || function(s) {
          return s;
        };
        return new lunr.Token(fn(this.str, this.metadata), this.metadata);
      };
      lunr.tokenizer = function(obj, metadata) {
        if (obj == null || obj == void 0) {
          return [];
        }
        if (Array.isArray(obj)) {
          return obj.map(function(t) {
            return new lunr.Token(
              lunr.utils.asString(t).toLowerCase(),
              lunr.utils.clone(metadata)
            );
          });
        }
        var str = obj.toString().toLowerCase(), len = str.length, tokens = [];
        for (var sliceEnd = 0, sliceStart = 0; sliceEnd <= len; sliceEnd++) {
          var char = str.charAt(sliceEnd), sliceLength = sliceEnd - sliceStart;
          if (char.match(lunr.tokenizer.separator) || sliceEnd == len) {
            if (sliceLength > 0) {
              var tokenMetadata = lunr.utils.clone(metadata) || {};
              tokenMetadata["position"] = [sliceStart, sliceLength];
              tokenMetadata["index"] = tokens.length;
              tokens.push(
                new lunr.Token(
                  str.slice(sliceStart, sliceEnd),
                  tokenMetadata
                )
              );
            }
            sliceStart = sliceEnd + 1;
          }
        }
        return tokens;
      };
      lunr.tokenizer.separator = /[\s\-]+/;
      lunr.Pipeline = function() {
        this._stack = [];
      };
      lunr.Pipeline.registeredFunctions = /* @__PURE__ */ Object.create(null);
      lunr.Pipeline.registerFunction = function(fn, label) {
        if (label in this.registeredFunctions) {
          lunr.utils.warn("Overwriting existing registered function: " + label);
        }
        fn.label = label;
        lunr.Pipeline.registeredFunctions[fn.label] = fn;
      };
      lunr.Pipeline.warnIfFunctionNotRegistered = function(fn) {
        var isRegistered = fn.label && fn.label in this.registeredFunctions;
        if (!isRegistered) {
          lunr.utils.warn("Function is not registered with pipeline. This may cause problems when serialising the index.\n", fn);
        }
      };
      lunr.Pipeline.load = function(serialised) {
        var pipeline = new lunr.Pipeline();
        serialised.forEach(function(fnName) {
          var fn = lunr.Pipeline.registeredFunctions[fnName];
          if (fn) {
            pipeline.add(fn);
          } else {
            throw new Error("Cannot load unregistered function: " + fnName);
          }
        });
        return pipeline;
      };
      lunr.Pipeline.prototype.add = function() {
        var fns = Array.prototype.slice.call(arguments);
        fns.forEach(function(fn) {
          lunr.Pipeline.warnIfFunctionNotRegistered(fn);
          this._stack.push(fn);
        }, this);
      };
      lunr.Pipeline.prototype.after = function(existingFn, newFn) {
        lunr.Pipeline.warnIfFunctionNotRegistered(newFn);
        var pos = this._stack.indexOf(existingFn);
        if (pos == -1) {
          throw new Error("Cannot find existingFn");
        }
        pos = pos + 1;
        this._stack.splice(pos, 0, newFn);
      };
      lunr.Pipeline.prototype.before = function(existingFn, newFn) {
        lunr.Pipeline.warnIfFunctionNotRegistered(newFn);
        var pos = this._stack.indexOf(existingFn);
        if (pos == -1) {
          throw new Error("Cannot find existingFn");
        }
        this._stack.splice(pos, 0, newFn);
      };
      lunr.Pipeline.prototype.remove = function(fn) {
        var pos = this._stack.indexOf(fn);
        if (pos == -1) {
          return;
        }
        this._stack.splice(pos, 1);
      };
      lunr.Pipeline.prototype.run = function(tokens) {
        var stackLength = this._stack.length;
        for (var i = 0; i < stackLength; i++) {
          var fn = this._stack[i];
          var memo = [];
          for (var j = 0; j < tokens.length; j++) {
            var result = fn(tokens[j], j, tokens);
            if (result === null || result === void 0 || result === "") continue;
            if (Array.isArray(result)) {
              for (var k = 0; k < result.length; k++) {
                memo.push(result[k]);
              }
            } else {
              memo.push(result);
            }
          }
          tokens = memo;
        }
        return tokens;
      };
      lunr.Pipeline.prototype.runString = function(str, metadata) {
        var token = new lunr.Token(str, metadata);
        return this.run([token]).map(function(t) {
          return t.toString();
        });
      };
      lunr.Pipeline.prototype.reset = function() {
        this._stack = [];
      };
      lunr.Pipeline.prototype.toJSON = function() {
        return this._stack.map(function(fn) {
          lunr.Pipeline.warnIfFunctionNotRegistered(fn);
          return fn.label;
        });
      };
      lunr.Vector = function(elements) {
        this._magnitude = 0;
        this.elements = elements || [];
      };
      lunr.Vector.prototype.positionForIndex = function(index) {
        if (this.elements.length == 0) {
          return 0;
        }
        var start = 0, end = this.elements.length / 2, sliceLength = end - start, pivotPoint = Math.floor(sliceLength / 2), pivotIndex = this.elements[pivotPoint * 2];
        while (sliceLength > 1) {
          if (pivotIndex < index) {
            start = pivotPoint;
          }
          if (pivotIndex > index) {
            end = pivotPoint;
          }
          if (pivotIndex == index) {
            break;
          }
          sliceLength = end - start;
          pivotPoint = start + Math.floor(sliceLength / 2);
          pivotIndex = this.elements[pivotPoint * 2];
        }
        if (pivotIndex == index) {
          return pivotPoint * 2;
        }
        if (pivotIndex > index) {
          return pivotPoint * 2;
        }
        if (pivotIndex < index) {
          return (pivotPoint + 1) * 2;
        }
      };
      lunr.Vector.prototype.insert = function(insertIdx, val) {
        this.upsert(insertIdx, val, function() {
          throw "duplicate index";
        });
      };
      lunr.Vector.prototype.upsert = function(insertIdx, val, fn) {
        this._magnitude = 0;
        var position = this.positionForIndex(insertIdx);
        if (this.elements[position] == insertIdx) {
          this.elements[position + 1] = fn(this.elements[position + 1], val);
        } else {
          this.elements.splice(position, 0, insertIdx, val);
        }
      };
      lunr.Vector.prototype.magnitude = function() {
        if (this._magnitude) return this._magnitude;
        var sumOfSquares = 0, elementsLength = this.elements.length;
        for (var i = 1; i < elementsLength; i += 2) {
          var val = this.elements[i];
          sumOfSquares += val * val;
        }
        return this._magnitude = Math.sqrt(sumOfSquares);
      };
      lunr.Vector.prototype.dot = function(otherVector) {
        var dotProduct = 0, a = this.elements, b = otherVector.elements, aLen = a.length, bLen = b.length, aVal = 0, bVal = 0, i = 0, j = 0;
        while (i < aLen && j < bLen) {
          aVal = a[i], bVal = b[j];
          if (aVal < bVal) {
            i += 2;
          } else if (aVal > bVal) {
            j += 2;
          } else if (aVal == bVal) {
            dotProduct += a[i + 1] * b[j + 1];
            i += 2;
            j += 2;
          }
        }
        return dotProduct;
      };
      lunr.Vector.prototype.similarity = function(otherVector) {
        return this.dot(otherVector) / this.magnitude() || 0;
      };
      lunr.Vector.prototype.toArray = function() {
        var output = new Array(this.elements.length / 2);
        for (var i = 1, j = 0; i < this.elements.length; i += 2, j++) {
          output[j] = this.elements[i];
        }
        return output;
      };
      lunr.Vector.prototype.toJSON = function() {
        return this.elements;
      };
      lunr.stemmer = function() {
        var step2list = {
          "ational": "ate",
          "tional": "tion",
          "enci": "ence",
          "anci": "ance",
          "izer": "ize",
          "bli": "ble",
          "alli": "al",
          "entli": "ent",
          "eli": "e",
          "ousli": "ous",
          "ization": "ize",
          "ation": "ate",
          "ator": "ate",
          "alism": "al",
          "iveness": "ive",
          "fulness": "ful",
          "ousness": "ous",
          "aliti": "al",
          "iviti": "ive",
          "biliti": "ble",
          "logi": "log"
        }, step3list = {
          "icate": "ic",
          "ative": "",
          "alize": "al",
          "iciti": "ic",
          "ical": "ic",
          "ful": "",
          "ness": ""
        }, c = "[^aeiou]", v = "[aeiouy]", C = c + "[^aeiouy]*", V = v + "[aeiou]*", mgr0 = "^(" + C + ")?" + V + C, meq1 = "^(" + C + ")?" + V + C + "(" + V + ")?$", mgr1 = "^(" + C + ")?" + V + C + V + C, s_v = "^(" + C + ")?" + v;
        var re_mgr0 = new RegExp(mgr0);
        var re_mgr1 = new RegExp(mgr1);
        var re_meq1 = new RegExp(meq1);
        var re_s_v = new RegExp(s_v);
        var re_1a = /^(.+?)(ss|i)es$/;
        var re2_1a = /^(.+?)([^s])s$/;
        var re_1b = /^(.+?)eed$/;
        var re2_1b = /^(.+?)(ed|ing)$/;
        var re_1b_2 = /.$/;
        var re2_1b_2 = /(at|bl|iz)$/;
        var re3_1b_2 = new RegExp("([^aeiouylsz])\\1$");
        var re4_1b_2 = new RegExp("^" + C + v + "[^aeiouwxy]$");
        var re_1c = /^(.+?[^aeiou])y$/;
        var re_2 = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;
        var re_3 = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;
        var re_4 = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;
        var re2_4 = /^(.+?)(s|t)(ion)$/;
        var re_5 = /^(.+?)e$/;
        var re_5_1 = /ll$/;
        var re3_5 = new RegExp("^" + C + v + "[^aeiouwxy]$");
        var porterStemmer = function porterStemmer2(w) {
          var stem, suffix, firstch, re, re2, re3, re4;
          if (w.length < 3) {
            return w;
          }
          firstch = w.substr(0, 1);
          if (firstch == "y") {
            w = firstch.toUpperCase() + w.substr(1);
          }
          re = re_1a;
          re2 = re2_1a;
          if (re.test(w)) {
            w = w.replace(re, "$1$2");
          } else if (re2.test(w)) {
            w = w.replace(re2, "$1$2");
          }
          re = re_1b;
          re2 = re2_1b;
          if (re.test(w)) {
            var fp = re.exec(w);
            re = re_mgr0;
            if (re.test(fp[1])) {
              re = re_1b_2;
              w = w.replace(re, "");
            }
          } else if (re2.test(w)) {
            var fp = re2.exec(w);
            stem = fp[1];
            re2 = re_s_v;
            if (re2.test(stem)) {
              w = stem;
              re2 = re2_1b_2;
              re3 = re3_1b_2;
              re4 = re4_1b_2;
              if (re2.test(w)) {
                w = w + "e";
              } else if (re3.test(w)) {
                re = re_1b_2;
                w = w.replace(re, "");
              } else if (re4.test(w)) {
                w = w + "e";
              }
            }
          }
          re = re_1c;
          if (re.test(w)) {
            var fp = re.exec(w);
            stem = fp[1];
            w = stem + "i";
          }
          re = re_2;
          if (re.test(w)) {
            var fp = re.exec(w);
            stem = fp[1];
            suffix = fp[2];
            re = re_mgr0;
            if (re.test(stem)) {
              w = stem + step2list[suffix];
            }
          }
          re = re_3;
          if (re.test(w)) {
            var fp = re.exec(w);
            stem = fp[1];
            suffix = fp[2];
            re = re_mgr0;
            if (re.test(stem)) {
              w = stem + step3list[suffix];
            }
          }
          re = re_4;
          re2 = re2_4;
          if (re.test(w)) {
            var fp = re.exec(w);
            stem = fp[1];
            re = re_mgr1;
            if (re.test(stem)) {
              w = stem;
            }
          } else if (re2.test(w)) {
            var fp = re2.exec(w);
            stem = fp[1] + fp[2];
            re2 = re_mgr1;
            if (re2.test(stem)) {
              w = stem;
            }
          }
          re = re_5;
          if (re.test(w)) {
            var fp = re.exec(w);
            stem = fp[1];
            re = re_mgr1;
            re2 = re_meq1;
            re3 = re3_5;
            if (re.test(stem) || re2.test(stem) && !re3.test(stem)) {
              w = stem;
            }
          }
          re = re_5_1;
          re2 = re_mgr1;
          if (re.test(w) && re2.test(w)) {
            re = re_1b_2;
            w = w.replace(re, "");
          }
          if (firstch == "y") {
            w = firstch.toLowerCase() + w.substr(1);
          }
          return w;
        };
        return function(token) {
          return token.update(porterStemmer);
        };
      }();
      lunr.Pipeline.registerFunction(lunr.stemmer, "stemmer");
      lunr.generateStopWordFilter = function(stopWords) {
        var words = stopWords.reduce(function(memo, stopWord) {
          memo[stopWord] = stopWord;
          return memo;
        }, {});
        return function(token) {
          if (token && words[token.toString()] !== token.toString()) return token;
        };
      };
      lunr.stopWordFilter = lunr.generateStopWordFilter([
        "a",
        "able",
        "about",
        "across",
        "after",
        "all",
        "almost",
        "also",
        "am",
        "among",
        "an",
        "and",
        "any",
        "are",
        "as",
        "at",
        "be",
        "because",
        "been",
        "but",
        "by",
        "can",
        "cannot",
        "could",
        "dear",
        "did",
        "do",
        "does",
        "either",
        "else",
        "ever",
        "every",
        "for",
        "from",
        "get",
        "got",
        "had",
        "has",
        "have",
        "he",
        "her",
        "hers",
        "him",
        "his",
        "how",
        "however",
        "i",
        "if",
        "in",
        "into",
        "is",
        "it",
        "its",
        "just",
        "least",
        "let",
        "like",
        "likely",
        "may",
        "me",
        "might",
        "most",
        "must",
        "my",
        "neither",
        "no",
        "nor",
        "not",
        "of",
        "off",
        "often",
        "on",
        "only",
        "or",
        "other",
        "our",
        "own",
        "rather",
        "said",
        "say",
        "says",
        "she",
        "should",
        "since",
        "so",
        "some",
        "than",
        "that",
        "the",
        "their",
        "them",
        "then",
        "there",
        "these",
        "they",
        "this",
        "tis",
        "to",
        "too",
        "twas",
        "us",
        "wants",
        "was",
        "we",
        "were",
        "what",
        "when",
        "where",
        "which",
        "while",
        "who",
        "whom",
        "why",
        "will",
        "with",
        "would",
        "yet",
        "you",
        "your"
      ]);
      lunr.Pipeline.registerFunction(lunr.stopWordFilter, "stopWordFilter");
      lunr.trimmer = function(token) {
        return token.update(function(s) {
          return s.replace(/^\W+/, "").replace(/\W+$/, "");
        });
      };
      lunr.Pipeline.registerFunction(lunr.trimmer, "trimmer");
      lunr.TokenSet = function() {
        this.final = false;
        this.edges = {};
        this.id = lunr.TokenSet._nextId;
        lunr.TokenSet._nextId += 1;
      };
      lunr.TokenSet._nextId = 1;
      lunr.TokenSet.fromArray = function(arr) {
        var builder = new lunr.TokenSet.Builder();
        for (var i = 0, len = arr.length; i < len; i++) {
          builder.insert(arr[i]);
        }
        builder.finish();
        return builder.root;
      };
      lunr.TokenSet.fromClause = function(clause) {
        if ("editDistance" in clause) {
          return lunr.TokenSet.fromFuzzyString(clause.term, clause.editDistance);
        } else {
          return lunr.TokenSet.fromString(clause.term);
        }
      };
      lunr.TokenSet.fromFuzzyString = function(str, editDistance) {
        var root = new lunr.TokenSet();
        var stack = [{
          node: root,
          editsRemaining: editDistance,
          str
        }];
        while (stack.length) {
          var frame = stack.pop();
          if (frame.str.length > 0) {
            var char = frame.str.charAt(0), noEditNode;
            if (char in frame.node.edges) {
              noEditNode = frame.node.edges[char];
            } else {
              noEditNode = new lunr.TokenSet();
              frame.node.edges[char] = noEditNode;
            }
            if (frame.str.length == 1) {
              noEditNode.final = true;
            }
            stack.push({
              node: noEditNode,
              editsRemaining: frame.editsRemaining,
              str: frame.str.slice(1)
            });
          }
          if (frame.editsRemaining == 0) {
            continue;
          }
          if ("*" in frame.node.edges) {
            var insertionNode = frame.node.edges["*"];
          } else {
            var insertionNode = new lunr.TokenSet();
            frame.node.edges["*"] = insertionNode;
          }
          if (frame.str.length == 0) {
            insertionNode.final = true;
          }
          stack.push({
            node: insertionNode,
            editsRemaining: frame.editsRemaining - 1,
            str: frame.str
          });
          if (frame.str.length > 1) {
            stack.push({
              node: frame.node,
              editsRemaining: frame.editsRemaining - 1,
              str: frame.str.slice(1)
            });
          }
          if (frame.str.length == 1) {
            frame.node.final = true;
          }
          if (frame.str.length >= 1) {
            if ("*" in frame.node.edges) {
              var substitutionNode = frame.node.edges["*"];
            } else {
              var substitutionNode = new lunr.TokenSet();
              frame.node.edges["*"] = substitutionNode;
            }
            if (frame.str.length == 1) {
              substitutionNode.final = true;
            }
            stack.push({
              node: substitutionNode,
              editsRemaining: frame.editsRemaining - 1,
              str: frame.str.slice(1)
            });
          }
          if (frame.str.length > 1) {
            var charA = frame.str.charAt(0), charB = frame.str.charAt(1), transposeNode;
            if (charB in frame.node.edges) {
              transposeNode = frame.node.edges[charB];
            } else {
              transposeNode = new lunr.TokenSet();
              frame.node.edges[charB] = transposeNode;
            }
            if (frame.str.length == 1) {
              transposeNode.final = true;
            }
            stack.push({
              node: transposeNode,
              editsRemaining: frame.editsRemaining - 1,
              str: charA + frame.str.slice(2)
            });
          }
        }
        return root;
      };
      lunr.TokenSet.fromString = function(str) {
        var node = new lunr.TokenSet(), root = node;
        for (var i = 0, len = str.length; i < len; i++) {
          var char = str[i], final = i == len - 1;
          if (char == "*") {
            node.edges[char] = node;
            node.final = final;
          } else {
            var next = new lunr.TokenSet();
            next.final = final;
            node.edges[char] = next;
            node = next;
          }
        }
        return root;
      };
      lunr.TokenSet.prototype.toArray = function() {
        var words = [];
        var stack = [{
          prefix: "",
          node: this
        }];
        while (stack.length) {
          var frame = stack.pop(), edges = Object.keys(frame.node.edges), len = edges.length;
          if (frame.node.final) {
            frame.prefix.charAt(0);
            words.push(frame.prefix);
          }
          for (var i = 0; i < len; i++) {
            var edge = edges[i];
            stack.push({
              prefix: frame.prefix.concat(edge),
              node: frame.node.edges[edge]
            });
          }
        }
        return words;
      };
      lunr.TokenSet.prototype.toString = function() {
        if (this._str) {
          return this._str;
        }
        var str = this.final ? "1" : "0", labels = Object.keys(this.edges).sort(), len = labels.length;
        for (var i = 0; i < len; i++) {
          var label = labels[i], node = this.edges[label];
          str = str + label + node.id;
        }
        return str;
      };
      lunr.TokenSet.prototype.intersect = function(b) {
        var output = new lunr.TokenSet(), frame = void 0;
        var stack = [{
          qNode: b,
          output,
          node: this
        }];
        while (stack.length) {
          frame = stack.pop();
          var qEdges = Object.keys(frame.qNode.edges), qLen = qEdges.length, nEdges = Object.keys(frame.node.edges), nLen = nEdges.length;
          for (var q = 0; q < qLen; q++) {
            var qEdge = qEdges[q];
            for (var n = 0; n < nLen; n++) {
              var nEdge = nEdges[n];
              if (nEdge == qEdge || qEdge == "*") {
                var node = frame.node.edges[nEdge], qNode = frame.qNode.edges[qEdge], final = node.final && qNode.final, next = void 0;
                if (nEdge in frame.output.edges) {
                  next = frame.output.edges[nEdge];
                  next.final = next.final || final;
                } else {
                  next = new lunr.TokenSet();
                  next.final = final;
                  frame.output.edges[nEdge] = next;
                }
                stack.push({
                  qNode,
                  output: next,
                  node
                });
              }
            }
          }
        }
        return output;
      };
      lunr.TokenSet.Builder = function() {
        this.previousWord = "";
        this.root = new lunr.TokenSet();
        this.uncheckedNodes = [];
        this.minimizedNodes = {};
      };
      lunr.TokenSet.Builder.prototype.insert = function(word) {
        var node, commonPrefix = 0;
        if (word < this.previousWord) {
          throw new Error("Out of order word insertion");
        }
        for (var i = 0; i < word.length && i < this.previousWord.length; i++) {
          if (word[i] != this.previousWord[i]) break;
          commonPrefix++;
        }
        this.minimize(commonPrefix);
        if (this.uncheckedNodes.length == 0) {
          node = this.root;
        } else {
          node = this.uncheckedNodes[this.uncheckedNodes.length - 1].child;
        }
        for (var i = commonPrefix; i < word.length; i++) {
          var nextNode = new lunr.TokenSet(), char = word[i];
          node.edges[char] = nextNode;
          this.uncheckedNodes.push({
            parent: node,
            char,
            child: nextNode
          });
          node = nextNode;
        }
        node.final = true;
        this.previousWord = word;
      };
      lunr.TokenSet.Builder.prototype.finish = function() {
        this.minimize(0);
      };
      lunr.TokenSet.Builder.prototype.minimize = function(downTo) {
        for (var i = this.uncheckedNodes.length - 1; i >= downTo; i--) {
          var node = this.uncheckedNodes[i], childKey = node.child.toString();
          if (childKey in this.minimizedNodes) {
            node.parent.edges[node.char] = this.minimizedNodes[childKey];
          } else {
            node.child._str = childKey;
            this.minimizedNodes[childKey] = node.child;
          }
          this.uncheckedNodes.pop();
        }
      };
      lunr.Index = function(attrs) {
        this.invertedIndex = attrs.invertedIndex;
        this.fieldVectors = attrs.fieldVectors;
        this.tokenSet = attrs.tokenSet;
        this.fields = attrs.fields;
        this.pipeline = attrs.pipeline;
      };
      lunr.Index.prototype.search = function(queryString) {
        return this.query(function(query) {
          var parser = new lunr.QueryParser(queryString, query);
          parser.parse();
        });
      };
      lunr.Index.prototype.query = function(fn) {
        var query = new lunr.Query(this.fields), matchingFields = /* @__PURE__ */ Object.create(null), queryVectors = /* @__PURE__ */ Object.create(null), termFieldCache = /* @__PURE__ */ Object.create(null), requiredMatches = /* @__PURE__ */ Object.create(null), prohibitedMatches = /* @__PURE__ */ Object.create(null);
        for (var i = 0; i < this.fields.length; i++) {
          queryVectors[this.fields[i]] = new lunr.Vector();
        }
        fn.call(query, query);
        for (var i = 0; i < query.clauses.length; i++) {
          var clause = query.clauses[i], terms = null, clauseMatches = lunr.Set.empty;
          if (clause.usePipeline) {
            terms = this.pipeline.runString(clause.term, {
              fields: clause.fields
            });
          } else {
            terms = [clause.term];
          }
          for (var m = 0; m < terms.length; m++) {
            var term = terms[m];
            clause.term = term;
            var termTokenSet = lunr.TokenSet.fromClause(clause), expandedTerms = this.tokenSet.intersect(termTokenSet).toArray();
            if (expandedTerms.length === 0 && clause.presence === lunr.Query.presence.REQUIRED) {
              for (var k = 0; k < clause.fields.length; k++) {
                var field = clause.fields[k];
                requiredMatches[field] = lunr.Set.empty;
              }
              break;
            }
            for (var j = 0; j < expandedTerms.length; j++) {
              var expandedTerm = expandedTerms[j], posting = this.invertedIndex[expandedTerm], termIndex = posting._index;
              for (var k = 0; k < clause.fields.length; k++) {
                var field = clause.fields[k], fieldPosting = posting[field], matchingDocumentRefs = Object.keys(fieldPosting), termField = expandedTerm + "/" + field, matchingDocumentsSet = new lunr.Set(matchingDocumentRefs);
                if (clause.presence == lunr.Query.presence.REQUIRED) {
                  clauseMatches = clauseMatches.union(matchingDocumentsSet);
                  if (requiredMatches[field] === void 0) {
                    requiredMatches[field] = lunr.Set.complete;
                  }
                }
                if (clause.presence == lunr.Query.presence.PROHIBITED) {
                  if (prohibitedMatches[field] === void 0) {
                    prohibitedMatches[field] = lunr.Set.empty;
                  }
                  prohibitedMatches[field] = prohibitedMatches[field].union(matchingDocumentsSet);
                  continue;
                }
                queryVectors[field].upsert(termIndex, clause.boost, function(a, b) {
                  return a + b;
                });
                if (termFieldCache[termField]) {
                  continue;
                }
                for (var l = 0; l < matchingDocumentRefs.length; l++) {
                  var matchingDocumentRef = matchingDocumentRefs[l], matchingFieldRef = new lunr.FieldRef(matchingDocumentRef, field), metadata = fieldPosting[matchingDocumentRef], fieldMatch;
                  if ((fieldMatch = matchingFields[matchingFieldRef]) === void 0) {
                    matchingFields[matchingFieldRef] = new lunr.MatchData(expandedTerm, field, metadata);
                  } else {
                    fieldMatch.add(expandedTerm, field, metadata);
                  }
                }
                termFieldCache[termField] = true;
              }
            }
          }
          if (clause.presence === lunr.Query.presence.REQUIRED) {
            for (var k = 0; k < clause.fields.length; k++) {
              var field = clause.fields[k];
              requiredMatches[field] = requiredMatches[field].intersect(clauseMatches);
            }
          }
        }
        var allRequiredMatches = lunr.Set.complete, allProhibitedMatches = lunr.Set.empty;
        for (var i = 0; i < this.fields.length; i++) {
          var field = this.fields[i];
          if (requiredMatches[field]) {
            allRequiredMatches = allRequiredMatches.intersect(requiredMatches[field]);
          }
          if (prohibitedMatches[field]) {
            allProhibitedMatches = allProhibitedMatches.union(prohibitedMatches[field]);
          }
        }
        var matchingFieldRefs = Object.keys(matchingFields), results = [], matches = /* @__PURE__ */ Object.create(null);
        if (query.isNegated()) {
          matchingFieldRefs = Object.keys(this.fieldVectors);
          for (var i = 0; i < matchingFieldRefs.length; i++) {
            var matchingFieldRef = matchingFieldRefs[i];
            var fieldRef = lunr.FieldRef.fromString(matchingFieldRef);
            matchingFields[matchingFieldRef] = new lunr.MatchData();
          }
        }
        for (var i = 0; i < matchingFieldRefs.length; i++) {
          var fieldRef = lunr.FieldRef.fromString(matchingFieldRefs[i]), docRef = fieldRef.docRef;
          if (!allRequiredMatches.contains(docRef)) {
            continue;
          }
          if (allProhibitedMatches.contains(docRef)) {
            continue;
          }
          var fieldVector = this.fieldVectors[fieldRef], score = queryVectors[fieldRef.fieldName].similarity(fieldVector), docMatch;
          if ((docMatch = matches[docRef]) !== void 0) {
            docMatch.score += score;
            docMatch.matchData.combine(matchingFields[fieldRef]);
          } else {
            var match = {
              ref: docRef,
              score,
              matchData: matchingFields[fieldRef]
            };
            matches[docRef] = match;
            results.push(match);
          }
        }
        return results.sort(function(a, b) {
          return b.score - a.score;
        });
      };
      lunr.Index.prototype.toJSON = function() {
        var invertedIndex = Object.keys(this.invertedIndex).sort().map(function(term) {
          return [term, this.invertedIndex[term]];
        }, this);
        var fieldVectors = Object.keys(this.fieldVectors).map(function(ref) {
          return [ref, this.fieldVectors[ref].toJSON()];
        }, this);
        return {
          version: lunr.version,
          fields: this.fields,
          fieldVectors,
          invertedIndex,
          pipeline: this.pipeline.toJSON()
        };
      };
      lunr.Index.load = function(serializedIndex) {
        var attrs = {}, fieldVectors = {}, serializedVectors = serializedIndex.fieldVectors, invertedIndex = /* @__PURE__ */ Object.create(null), serializedInvertedIndex = serializedIndex.invertedIndex, tokenSetBuilder = new lunr.TokenSet.Builder(), pipeline = lunr.Pipeline.load(serializedIndex.pipeline);
        if (serializedIndex.version != lunr.version) {
          lunr.utils.warn("Version mismatch when loading serialised index. Current version of lunr '" + lunr.version + "' does not match serialized index '" + serializedIndex.version + "'");
        }
        for (var i = 0; i < serializedVectors.length; i++) {
          var tuple = serializedVectors[i], ref = tuple[0], elements = tuple[1];
          fieldVectors[ref] = new lunr.Vector(elements);
        }
        for (var i = 0; i < serializedInvertedIndex.length; i++) {
          var tuple = serializedInvertedIndex[i], term = tuple[0], posting = tuple[1];
          tokenSetBuilder.insert(term);
          invertedIndex[term] = posting;
        }
        tokenSetBuilder.finish();
        attrs.fields = serializedIndex.fields;
        attrs.fieldVectors = fieldVectors;
        attrs.invertedIndex = invertedIndex;
        attrs.tokenSet = tokenSetBuilder.root;
        attrs.pipeline = pipeline;
        return new lunr.Index(attrs);
      };
      lunr.Builder = function() {
        this._ref = "id";
        this._fields = /* @__PURE__ */ Object.create(null);
        this._documents = /* @__PURE__ */ Object.create(null);
        this.invertedIndex = /* @__PURE__ */ Object.create(null);
        this.fieldTermFrequencies = {};
        this.fieldLengths = {};
        this.tokenizer = lunr.tokenizer;
        this.pipeline = new lunr.Pipeline();
        this.searchPipeline = new lunr.Pipeline();
        this.documentCount = 0;
        this._b = 0.75;
        this._k1 = 1.2;
        this.termIndex = 0;
        this.metadataWhitelist = [];
      };
      lunr.Builder.prototype.ref = function(ref) {
        this._ref = ref;
      };
      lunr.Builder.prototype.field = function(fieldName, attributes) {
        if (/\//.test(fieldName)) {
          throw new RangeError("Field '" + fieldName + "' contains illegal character '/'");
        }
        this._fields[fieldName] = attributes || {};
      };
      lunr.Builder.prototype.b = function(number) {
        if (number < 0) {
          this._b = 0;
        } else if (number > 1) {
          this._b = 1;
        } else {
          this._b = number;
        }
      };
      lunr.Builder.prototype.k1 = function(number) {
        this._k1 = number;
      };
      lunr.Builder.prototype.add = function(doc, attributes) {
        var docRef = doc[this._ref], fields = Object.keys(this._fields);
        this._documents[docRef] = attributes || {};
        this.documentCount += 1;
        for (var i = 0; i < fields.length; i++) {
          var fieldName = fields[i], extractor = this._fields[fieldName].extractor, field = extractor ? extractor(doc) : doc[fieldName], tokens = this.tokenizer(field, {
            fields: [fieldName]
          }), terms = this.pipeline.run(tokens), fieldRef = new lunr.FieldRef(docRef, fieldName), fieldTerms = /* @__PURE__ */ Object.create(null);
          this.fieldTermFrequencies[fieldRef] = fieldTerms;
          this.fieldLengths[fieldRef] = 0;
          this.fieldLengths[fieldRef] += terms.length;
          for (var j = 0; j < terms.length; j++) {
            var term = terms[j];
            if (fieldTerms[term] == void 0) {
              fieldTerms[term] = 0;
            }
            fieldTerms[term] += 1;
            if (this.invertedIndex[term] == void 0) {
              var posting = /* @__PURE__ */ Object.create(null);
              posting["_index"] = this.termIndex;
              this.termIndex += 1;
              for (var k = 0; k < fields.length; k++) {
                posting[fields[k]] = /* @__PURE__ */ Object.create(null);
              }
              this.invertedIndex[term] = posting;
            }
            if (this.invertedIndex[term][fieldName][docRef] == void 0) {
              this.invertedIndex[term][fieldName][docRef] = /* @__PURE__ */ Object.create(null);
            }
            for (var l = 0; l < this.metadataWhitelist.length; l++) {
              var metadataKey = this.metadataWhitelist[l], metadata = term.metadata[metadataKey];
              if (this.invertedIndex[term][fieldName][docRef][metadataKey] == void 0) {
                this.invertedIndex[term][fieldName][docRef][metadataKey] = [];
              }
              this.invertedIndex[term][fieldName][docRef][metadataKey].push(metadata);
            }
          }
        }
      };
      lunr.Builder.prototype.calculateAverageFieldLengths = function() {
        var fieldRefs = Object.keys(this.fieldLengths), numberOfFields = fieldRefs.length, accumulator = {}, documentsWithField = {};
        for (var i = 0; i < numberOfFields; i++) {
          var fieldRef = lunr.FieldRef.fromString(fieldRefs[i]), field = fieldRef.fieldName;
          documentsWithField[field] || (documentsWithField[field] = 0);
          documentsWithField[field] += 1;
          accumulator[field] || (accumulator[field] = 0);
          accumulator[field] += this.fieldLengths[fieldRef];
        }
        var fields = Object.keys(this._fields);
        for (var i = 0; i < fields.length; i++) {
          var fieldName = fields[i];
          accumulator[fieldName] = accumulator[fieldName] / documentsWithField[fieldName];
        }
        this.averageFieldLength = accumulator;
      };
      lunr.Builder.prototype.createFieldVectors = function() {
        var fieldVectors = {}, fieldRefs = Object.keys(this.fieldTermFrequencies), fieldRefsLength = fieldRefs.length, termIdfCache = /* @__PURE__ */ Object.create(null);
        for (var i = 0; i < fieldRefsLength; i++) {
          var fieldRef = lunr.FieldRef.fromString(fieldRefs[i]), fieldName = fieldRef.fieldName, fieldLength = this.fieldLengths[fieldRef], fieldVector = new lunr.Vector(), termFrequencies = this.fieldTermFrequencies[fieldRef], terms = Object.keys(termFrequencies), termsLength = terms.length;
          var fieldBoost = this._fields[fieldName].boost || 1, docBoost = this._documents[fieldRef.docRef].boost || 1;
          for (var j = 0; j < termsLength; j++) {
            var term = terms[j], tf = termFrequencies[term], termIndex = this.invertedIndex[term]._index, idf, score, scoreWithPrecision;
            if (termIdfCache[term] === void 0) {
              idf = lunr.idf(this.invertedIndex[term], this.documentCount);
              termIdfCache[term] = idf;
            } else {
              idf = termIdfCache[term];
            }
            score = idf * ((this._k1 + 1) * tf) / (this._k1 * (1 - this._b + this._b * (fieldLength / this.averageFieldLength[fieldName])) + tf);
            score *= fieldBoost;
            score *= docBoost;
            scoreWithPrecision = Math.round(score * 1e3) / 1e3;
            fieldVector.insert(termIndex, scoreWithPrecision);
          }
          fieldVectors[fieldRef] = fieldVector;
        }
        this.fieldVectors = fieldVectors;
      };
      lunr.Builder.prototype.createTokenSet = function() {
        this.tokenSet = lunr.TokenSet.fromArray(
          Object.keys(this.invertedIndex).sort()
        );
      };
      lunr.Builder.prototype.build = function() {
        this.calculateAverageFieldLengths();
        this.createFieldVectors();
        this.createTokenSet();
        return new lunr.Index({
          invertedIndex: this.invertedIndex,
          fieldVectors: this.fieldVectors,
          tokenSet: this.tokenSet,
          fields: Object.keys(this._fields),
          pipeline: this.searchPipeline
        });
      };
      lunr.Builder.prototype.use = function(fn) {
        var args = Array.prototype.slice.call(arguments, 1);
        args.unshift(this);
        fn.apply(this, args);
      };
      lunr.MatchData = function(term, field, metadata) {
        var clonedMetadata = /* @__PURE__ */ Object.create(null), metadataKeys = Object.keys(metadata || {});
        for (var i = 0; i < metadataKeys.length; i++) {
          var key = metadataKeys[i];
          clonedMetadata[key] = metadata[key].slice();
        }
        this.metadata = /* @__PURE__ */ Object.create(null);
        if (term !== void 0) {
          this.metadata[term] = /* @__PURE__ */ Object.create(null);
          this.metadata[term][field] = clonedMetadata;
        }
      };
      lunr.MatchData.prototype.combine = function(otherMatchData) {
        var terms = Object.keys(otherMatchData.metadata);
        for (var i = 0; i < terms.length; i++) {
          var term = terms[i], fields = Object.keys(otherMatchData.metadata[term]);
          if (this.metadata[term] == void 0) {
            this.metadata[term] = /* @__PURE__ */ Object.create(null);
          }
          for (var j = 0; j < fields.length; j++) {
            var field = fields[j], keys = Object.keys(otherMatchData.metadata[term][field]);
            if (this.metadata[term][field] == void 0) {
              this.metadata[term][field] = /* @__PURE__ */ Object.create(null);
            }
            for (var k = 0; k < keys.length; k++) {
              var key = keys[k];
              if (this.metadata[term][field][key] == void 0) {
                this.metadata[term][field][key] = otherMatchData.metadata[term][field][key];
              } else {
                this.metadata[term][field][key] = this.metadata[term][field][key].concat(otherMatchData.metadata[term][field][key]);
              }
            }
          }
        }
      };
      lunr.MatchData.prototype.add = function(term, field, metadata) {
        if (!(term in this.metadata)) {
          this.metadata[term] = /* @__PURE__ */ Object.create(null);
          this.metadata[term][field] = metadata;
          return;
        }
        if (!(field in this.metadata[term])) {
          this.metadata[term][field] = metadata;
          return;
        }
        var metadataKeys = Object.keys(metadata);
        for (var i = 0; i < metadataKeys.length; i++) {
          var key = metadataKeys[i];
          if (key in this.metadata[term][field]) {
            this.metadata[term][field][key] = this.metadata[term][field][key].concat(metadata[key]);
          } else {
            this.metadata[term][field][key] = metadata[key];
          }
        }
      };
      lunr.Query = function(allFields) {
        this.clauses = [];
        this.allFields = allFields;
      };
      lunr.Query.wildcard = new String("*");
      lunr.Query.wildcard.NONE = 0;
      lunr.Query.wildcard.LEADING = 1;
      lunr.Query.wildcard.TRAILING = 2;
      lunr.Query.presence = {
        /**
         * Term's presence in a document is optional, this is the default value.
         */
        OPTIONAL: 1,
        /**
         * Term's presence in a document is required, documents that do not contain
         * this term will not be returned.
         */
        REQUIRED: 2,
        /**
         * Term's presence in a document is prohibited, documents that do contain
         * this term will not be returned.
         */
        PROHIBITED: 3
      };
      lunr.Query.prototype.clause = function(clause) {
        if (!("fields" in clause)) {
          clause.fields = this.allFields;
        }
        if (!("boost" in clause)) {
          clause.boost = 1;
        }
        if (!("usePipeline" in clause)) {
          clause.usePipeline = true;
        }
        if (!("wildcard" in clause)) {
          clause.wildcard = lunr.Query.wildcard.NONE;
        }
        if (clause.wildcard & lunr.Query.wildcard.LEADING && clause.term.charAt(0) != lunr.Query.wildcard) {
          clause.term = "*" + clause.term;
        }
        if (clause.wildcard & lunr.Query.wildcard.TRAILING && clause.term.slice(-1) != lunr.Query.wildcard) {
          clause.term = "" + clause.term + "*";
        }
        if (!("presence" in clause)) {
          clause.presence = lunr.Query.presence.OPTIONAL;
        }
        this.clauses.push(clause);
        return this;
      };
      lunr.Query.prototype.isNegated = function() {
        for (var i = 0; i < this.clauses.length; i++) {
          if (this.clauses[i].presence != lunr.Query.presence.PROHIBITED) {
            return false;
          }
        }
        return true;
      };
      lunr.Query.prototype.term = function(term, options) {
        if (Array.isArray(term)) {
          term.forEach(function(t) {
            this.term(t, lunr.utils.clone(options));
          }, this);
          return this;
        }
        var clause = options || {};
        clause.term = term.toString();
        this.clause(clause);
        return this;
      };
      lunr.QueryParseError = function(message, start, end) {
        this.name = "QueryParseError";
        this.message = message;
        this.start = start;
        this.end = end;
      };
      lunr.QueryParseError.prototype = new Error();
      lunr.QueryLexer = function(str) {
        this.lexemes = [];
        this.str = str;
        this.length = str.length;
        this.pos = 0;
        this.start = 0;
        this.escapeCharPositions = [];
      };
      lunr.QueryLexer.prototype.run = function() {
        var state = lunr.QueryLexer.lexText;
        while (state) {
          state = state(this);
        }
      };
      lunr.QueryLexer.prototype.sliceString = function() {
        var subSlices = [], sliceStart = this.start, sliceEnd = this.pos;
        for (var i = 0; i < this.escapeCharPositions.length; i++) {
          sliceEnd = this.escapeCharPositions[i];
          subSlices.push(this.str.slice(sliceStart, sliceEnd));
          sliceStart = sliceEnd + 1;
        }
        subSlices.push(this.str.slice(sliceStart, this.pos));
        this.escapeCharPositions.length = 0;
        return subSlices.join("");
      };
      lunr.QueryLexer.prototype.emit = function(type) {
        this.lexemes.push({
          type,
          str: this.sliceString(),
          start: this.start,
          end: this.pos
        });
        this.start = this.pos;
      };
      lunr.QueryLexer.prototype.escapeCharacter = function() {
        this.escapeCharPositions.push(this.pos - 1);
        this.pos += 1;
      };
      lunr.QueryLexer.prototype.next = function() {
        if (this.pos >= this.length) {
          return lunr.QueryLexer.EOS;
        }
        var char = this.str.charAt(this.pos);
        this.pos += 1;
        return char;
      };
      lunr.QueryLexer.prototype.width = function() {
        return this.pos - this.start;
      };
      lunr.QueryLexer.prototype.ignore = function() {
        if (this.start == this.pos) {
          this.pos += 1;
        }
        this.start = this.pos;
      };
      lunr.QueryLexer.prototype.backup = function() {
        this.pos -= 1;
      };
      lunr.QueryLexer.prototype.acceptDigitRun = function() {
        var char, charCode;
        do {
          char = this.next();
          charCode = char.charCodeAt(0);
        } while (charCode > 47 && charCode < 58);
        if (char != lunr.QueryLexer.EOS) {
          this.backup();
        }
      };
      lunr.QueryLexer.prototype.more = function() {
        return this.pos < this.length;
      };
      lunr.QueryLexer.EOS = "EOS";
      lunr.QueryLexer.FIELD = "FIELD";
      lunr.QueryLexer.TERM = "TERM";
      lunr.QueryLexer.EDIT_DISTANCE = "EDIT_DISTANCE";
      lunr.QueryLexer.BOOST = "BOOST";
      lunr.QueryLexer.PRESENCE = "PRESENCE";
      lunr.QueryLexer.lexField = function(lexer) {
        lexer.backup();
        lexer.emit(lunr.QueryLexer.FIELD);
        lexer.ignore();
        return lunr.QueryLexer.lexText;
      };
      lunr.QueryLexer.lexTerm = function(lexer) {
        if (lexer.width() > 1) {
          lexer.backup();
          lexer.emit(lunr.QueryLexer.TERM);
        }
        lexer.ignore();
        if (lexer.more()) {
          return lunr.QueryLexer.lexText;
        }
      };
      lunr.QueryLexer.lexEditDistance = function(lexer) {
        lexer.ignore();
        lexer.acceptDigitRun();
        lexer.emit(lunr.QueryLexer.EDIT_DISTANCE);
        return lunr.QueryLexer.lexText;
      };
      lunr.QueryLexer.lexBoost = function(lexer) {
        lexer.ignore();
        lexer.acceptDigitRun();
        lexer.emit(lunr.QueryLexer.BOOST);
        return lunr.QueryLexer.lexText;
      };
      lunr.QueryLexer.lexEOS = function(lexer) {
        if (lexer.width() > 0) {
          lexer.emit(lunr.QueryLexer.TERM);
        }
      };
      lunr.QueryLexer.termSeparator = lunr.tokenizer.separator;
      lunr.QueryLexer.lexText = function(lexer) {
        while (true) {
          var char = lexer.next();
          if (char == lunr.QueryLexer.EOS) {
            return lunr.QueryLexer.lexEOS;
          }
          if (char.charCodeAt(0) == 92) {
            lexer.escapeCharacter();
            continue;
          }
          if (char == ":") {
            return lunr.QueryLexer.lexField;
          }
          if (char == "~") {
            lexer.backup();
            if (lexer.width() > 0) {
              lexer.emit(lunr.QueryLexer.TERM);
            }
            return lunr.QueryLexer.lexEditDistance;
          }
          if (char == "^") {
            lexer.backup();
            if (lexer.width() > 0) {
              lexer.emit(lunr.QueryLexer.TERM);
            }
            return lunr.QueryLexer.lexBoost;
          }
          if (char == "+" && lexer.width() === 1) {
            lexer.emit(lunr.QueryLexer.PRESENCE);
            return lunr.QueryLexer.lexText;
          }
          if (char == "-" && lexer.width() === 1) {
            lexer.emit(lunr.QueryLexer.PRESENCE);
            return lunr.QueryLexer.lexText;
          }
          if (char.match(lunr.QueryLexer.termSeparator)) {
            return lunr.QueryLexer.lexTerm;
          }
        }
      };
      lunr.QueryParser = function(str, query) {
        this.lexer = new lunr.QueryLexer(str);
        this.query = query;
        this.currentClause = {};
        this.lexemeIdx = 0;
      };
      lunr.QueryParser.prototype.parse = function() {
        this.lexer.run();
        this.lexemes = this.lexer.lexemes;
        var state = lunr.QueryParser.parseClause;
        while (state) {
          state = state(this);
        }
        return this.query;
      };
      lunr.QueryParser.prototype.peekLexeme = function() {
        return this.lexemes[this.lexemeIdx];
      };
      lunr.QueryParser.prototype.consumeLexeme = function() {
        var lexeme = this.peekLexeme();
        this.lexemeIdx += 1;
        return lexeme;
      };
      lunr.QueryParser.prototype.nextClause = function() {
        var completedClause = this.currentClause;
        this.query.clause(completedClause);
        this.currentClause = {};
      };
      lunr.QueryParser.parseClause = function(parser) {
        var lexeme = parser.peekLexeme();
        if (lexeme == void 0) {
          return;
        }
        switch (lexeme.type) {
          case lunr.QueryLexer.PRESENCE:
            return lunr.QueryParser.parsePresence;
          case lunr.QueryLexer.FIELD:
            return lunr.QueryParser.parseField;
          case lunr.QueryLexer.TERM:
            return lunr.QueryParser.parseTerm;
          default:
            var errorMessage = "expected either a field or a term, found " + lexeme.type;
            if (lexeme.str.length >= 1) {
              errorMessage += " with value '" + lexeme.str + "'";
            }
            throw new lunr.QueryParseError(errorMessage, lexeme.start, lexeme.end);
        }
      };
      lunr.QueryParser.parsePresence = function(parser) {
        var lexeme = parser.consumeLexeme();
        if (lexeme == void 0) {
          return;
        }
        switch (lexeme.str) {
          case "-":
            parser.currentClause.presence = lunr.Query.presence.PROHIBITED;
            break;
          case "+":
            parser.currentClause.presence = lunr.Query.presence.REQUIRED;
            break;
          default:
            var errorMessage = "unrecognised presence operator'" + lexeme.str + "'";
            throw new lunr.QueryParseError(errorMessage, lexeme.start, lexeme.end);
        }
        var nextLexeme = parser.peekLexeme();
        if (nextLexeme == void 0) {
          var errorMessage = "expecting term or field, found nothing";
          throw new lunr.QueryParseError(errorMessage, lexeme.start, lexeme.end);
        }
        switch (nextLexeme.type) {
          case lunr.QueryLexer.FIELD:
            return lunr.QueryParser.parseField;
          case lunr.QueryLexer.TERM:
            return lunr.QueryParser.parseTerm;
          default:
            var errorMessage = "expecting term or field, found '" + nextLexeme.type + "'";
            throw new lunr.QueryParseError(errorMessage, nextLexeme.start, nextLexeme.end);
        }
      };
      lunr.QueryParser.parseField = function(parser) {
        var lexeme = parser.consumeLexeme();
        if (lexeme == void 0) {
          return;
        }
        if (parser.query.allFields.indexOf(lexeme.str) == -1) {
          var possibleFields = parser.query.allFields.map(function(f) {
            return "'" + f + "'";
          }).join(", "), errorMessage = "unrecognised field '" + lexeme.str + "', possible fields: " + possibleFields;
          throw new lunr.QueryParseError(errorMessage, lexeme.start, lexeme.end);
        }
        parser.currentClause.fields = [lexeme.str];
        var nextLexeme = parser.peekLexeme();
        if (nextLexeme == void 0) {
          var errorMessage = "expecting term, found nothing";
          throw new lunr.QueryParseError(errorMessage, lexeme.start, lexeme.end);
        }
        switch (nextLexeme.type) {
          case lunr.QueryLexer.TERM:
            return lunr.QueryParser.parseTerm;
          default:
            var errorMessage = "expecting term, found '" + nextLexeme.type + "'";
            throw new lunr.QueryParseError(errorMessage, nextLexeme.start, nextLexeme.end);
        }
      };
      lunr.QueryParser.parseTerm = function(parser) {
        var lexeme = parser.consumeLexeme();
        if (lexeme == void 0) {
          return;
        }
        parser.currentClause.term = lexeme.str.toLowerCase();
        if (lexeme.str.indexOf("*") != -1) {
          parser.currentClause.usePipeline = false;
        }
        var nextLexeme = parser.peekLexeme();
        if (nextLexeme == void 0) {
          parser.nextClause();
          return;
        }
        switch (nextLexeme.type) {
          case lunr.QueryLexer.TERM:
            parser.nextClause();
            return lunr.QueryParser.parseTerm;
          case lunr.QueryLexer.FIELD:
            parser.nextClause();
            return lunr.QueryParser.parseField;
          case lunr.QueryLexer.EDIT_DISTANCE:
            return lunr.QueryParser.parseEditDistance;
          case lunr.QueryLexer.BOOST:
            return lunr.QueryParser.parseBoost;
          case lunr.QueryLexer.PRESENCE:
            parser.nextClause();
            return lunr.QueryParser.parsePresence;
          default:
            var errorMessage = "Unexpected lexeme type '" + nextLexeme.type + "'";
            throw new lunr.QueryParseError(errorMessage, nextLexeme.start, nextLexeme.end);
        }
      };
      lunr.QueryParser.parseEditDistance = function(parser) {
        var lexeme = parser.consumeLexeme();
        if (lexeme == void 0) {
          return;
        }
        var editDistance = parseInt(lexeme.str, 10);
        if (isNaN(editDistance)) {
          var errorMessage = "edit distance must be numeric";
          throw new lunr.QueryParseError(errorMessage, lexeme.start, lexeme.end);
        }
        parser.currentClause.editDistance = editDistance;
        var nextLexeme = parser.peekLexeme();
        if (nextLexeme == void 0) {
          parser.nextClause();
          return;
        }
        switch (nextLexeme.type) {
          case lunr.QueryLexer.TERM:
            parser.nextClause();
            return lunr.QueryParser.parseTerm;
          case lunr.QueryLexer.FIELD:
            parser.nextClause();
            return lunr.QueryParser.parseField;
          case lunr.QueryLexer.EDIT_DISTANCE:
            return lunr.QueryParser.parseEditDistance;
          case lunr.QueryLexer.BOOST:
            return lunr.QueryParser.parseBoost;
          case lunr.QueryLexer.PRESENCE:
            parser.nextClause();
            return lunr.QueryParser.parsePresence;
          default:
            var errorMessage = "Unexpected lexeme type '" + nextLexeme.type + "'";
            throw new lunr.QueryParseError(errorMessage, nextLexeme.start, nextLexeme.end);
        }
      };
      lunr.QueryParser.parseBoost = function(parser) {
        var lexeme = parser.consumeLexeme();
        if (lexeme == void 0) {
          return;
        }
        var boost = parseInt(lexeme.str, 10);
        if (isNaN(boost)) {
          var errorMessage = "boost must be numeric";
          throw new lunr.QueryParseError(errorMessage, lexeme.start, lexeme.end);
        }
        parser.currentClause.boost = boost;
        var nextLexeme = parser.peekLexeme();
        if (nextLexeme == void 0) {
          parser.nextClause();
          return;
        }
        switch (nextLexeme.type) {
          case lunr.QueryLexer.TERM:
            parser.nextClause();
            return lunr.QueryParser.parseTerm;
          case lunr.QueryLexer.FIELD:
            parser.nextClause();
            return lunr.QueryParser.parseField;
          case lunr.QueryLexer.EDIT_DISTANCE:
            return lunr.QueryParser.parseEditDistance;
          case lunr.QueryLexer.BOOST:
            return lunr.QueryParser.parseBoost;
          case lunr.QueryLexer.PRESENCE:
            parser.nextClause();
            return lunr.QueryParser.parsePresence;
          default:
            var errorMessage = "Unexpected lexeme type '" + nextLexeme.type + "'";
            throw new lunr.QueryParseError(errorMessage, nextLexeme.start, nextLexeme.end);
        }
      };
      (function(root, factory) {
        if (typeof define === "function" && define.amd) {
          define(factory);
        } else if (typeof exports === "object") {
          module.exports = factory();
        } else {
          root.lunr = factory();
        }
      })(this, function() {
        return lunr;
      });
    })();
  }
});
export default require_lunr();
/*! Bundled license information:

lunr/lunr.js:
  (**
   * lunr - http://lunrjs.com - A bit like Solr, but much smaller and not as bright - 2.3.9
   * Copyright (C) 2020 Oliver Nightingale
   * @license MIT
   *)
  (*!
   * lunr.utils
   * Copyright (C) 2020 Oliver Nightingale
   *)
  (*!
   * lunr.Set
   * Copyright (C) 2020 Oliver Nightingale
   *)
  (*!
   * lunr.tokenizer
   * Copyright (C) 2020 Oliver Nightingale
   *)
  (*!
   * lunr.Pipeline
   * Copyright (C) 2020 Oliver Nightingale
   *)
  (*!
   * lunr.Vector
   * Copyright (C) 2020 Oliver Nightingale
   *)
  (*!
   * lunr.stemmer
   * Copyright (C) 2020 Oliver Nightingale
   * Includes code from - http://tartarus.org/~martin/PorterStemmer/js.txt
   *)
  (*!
   * lunr.stopWordFilter
   * Copyright (C) 2020 Oliver Nightingale
   *)
  (*!
   * lunr.trimmer
   * Copyright (C) 2020 Oliver Nightingale
   *)
  (*!
   * lunr.TokenSet
   * Copyright (C) 2020 Oliver Nightingale
   *)
  (*!
   * lunr.Index
   * Copyright (C) 2020 Oliver Nightingale
   *)
  (*!
   * lunr.Builder
   * Copyright (C) 2020 Oliver Nightingale
   *)
*/
//# sourceMappingURL=lunr.js.map
