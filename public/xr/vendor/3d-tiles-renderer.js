var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __esm = (fn3, res) => function __init() {
  return fn3 && (res = (0, fn3[__getOwnPropNames(fn3)[0]])(fn3 = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// node_modules/@mapbox/point-geometry/index.js
function Point(x6, y6) {
  this.x = x6;
  this.y = y6;
}
var init_point_geometry = __esm({
  "node_modules/@mapbox/point-geometry/index.js"() {
    Point.prototype = {
      /**
       * Clone this point, returning a new point that can be modified
       * without affecting the old one.
       * @return {Point} the clone
       */
      clone() {
        return new Point(this.x, this.y);
      },
      /**
       * Add this point's x & y coordinates to another point,
       * yielding a new point.
       * @param {Point} p the other point
       * @return {Point} output point
       */
      add(p4) {
        return this.clone()._add(p4);
      },
      /**
       * Subtract this point's x & y coordinates to from point,
       * yielding a new point.
       * @param {Point} p the other point
       * @return {Point} output point
       */
      sub(p4) {
        return this.clone()._sub(p4);
      },
      /**
       * Multiply this point's x & y coordinates by point,
       * yielding a new point.
       * @param {Point} p the other point
       * @return {Point} output point
       */
      multByPoint(p4) {
        return this.clone()._multByPoint(p4);
      },
      /**
       * Divide this point's x & y coordinates by point,
       * yielding a new point.
       * @param {Point} p the other point
       * @return {Point} output point
       */
      divByPoint(p4) {
        return this.clone()._divByPoint(p4);
      },
      /**
       * Multiply this point's x & y coordinates by a factor,
       * yielding a new point.
       * @param {number} k factor
       * @return {Point} output point
       */
      mult(k5) {
        return this.clone()._mult(k5);
      },
      /**
       * Divide this point's x & y coordinates by a factor,
       * yielding a new point.
       * @param {number} k factor
       * @return {Point} output point
       */
      div(k5) {
        return this.clone()._div(k5);
      },
      /**
       * Rotate this point around the 0, 0 origin by an angle a,
       * given in radians
       * @param {number} a angle to rotate around, in radians
       * @return {Point} output point
       */
      rotate(a3) {
        return this.clone()._rotate(a3);
      },
      /**
       * Rotate this point around p point by an angle a,
       * given in radians
       * @param {number} a angle to rotate around, in radians
       * @param {Point} p Point to rotate around
       * @return {Point} output point
       */
      rotateAround(a3, p4) {
        return this.clone()._rotateAround(a3, p4);
      },
      /**
       * Multiply this point by a 4x1 transformation matrix
       * @param {[number, number, number, number]} m transformation matrix
       * @return {Point} output point
       */
      matMult(m4) {
        return this.clone()._matMult(m4);
      },
      /**
       * Calculate this point but as a unit vector from 0, 0, meaning
       * that the distance from the resulting point to the 0, 0
       * coordinate will be equal to 1 and the angle from the resulting
       * point to the 0, 0 coordinate will be the same as before.
       * @return {Point} unit vector point
       */
      unit() {
        return this.clone()._unit();
      },
      /**
       * Compute a perpendicular point, where the new y coordinate
       * is the old x coordinate and the new x coordinate is the old y
       * coordinate multiplied by -1
       * @return {Point} perpendicular point
       */
      perp() {
        return this.clone()._perp();
      },
      /**
       * Return a version of this point with the x & y coordinates
       * rounded to integers.
       * @return {Point} rounded point
       */
      round() {
        return this.clone()._round();
      },
      /**
       * Return the magnitude of this point: this is the Euclidean
       * distance from the 0, 0 coordinate to this point's x and y
       * coordinates.
       * @return {number} magnitude
       */
      mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
      },
      /**
       * Judge whether this point is equal to another point, returning
       * true or false.
       * @param {Point} other the other point
       * @return {boolean} whether the points are equal
       */
      equals(other) {
        return this.x === other.x && this.y === other.y;
      },
      /**
       * Calculate the distance from this point to another point
       * @param {Point} p the other point
       * @return {number} distance
       */
      dist(p4) {
        return Math.sqrt(this.distSqr(p4));
      },
      /**
       * Calculate the distance from this point to another point,
       * without the square root step. Useful if you're comparing
       * relative distances.
       * @param {Point} p the other point
       * @return {number} distance
       */
      distSqr(p4) {
        const dx = p4.x - this.x, dy = p4.y - this.y;
        return dx * dx + dy * dy;
      },
      /**
       * Get the angle from the 0, 0 coordinate to this point, in radians
       * coordinates.
       * @return {number} angle
       */
      angle() {
        return Math.atan2(this.y, this.x);
      },
      /**
       * Get the angle from this point to another point, in radians
       * @param {Point} b the other point
       * @return {number} angle
       */
      angleTo(b6) {
        return Math.atan2(this.y - b6.y, this.x - b6.x);
      },
      /**
       * Get the angle between this point and another point, in radians
       * @param {Point} b the other point
       * @return {number} angle
       */
      angleWith(b6) {
        return this.angleWithSep(b6.x, b6.y);
      },
      /**
       * Find the angle of the two vectors, solving the formula for
       * the cross product a x b = |a||b|sin(θ) for θ.
       * @param {number} x the x-coordinate
       * @param {number} y the y-coordinate
       * @return {number} the angle in radians
       */
      angleWithSep(x6, y6) {
        return Math.atan2(
          this.x * y6 - this.y * x6,
          this.x * x6 + this.y * y6
        );
      },
      /** @param {[number, number, number, number]} m */
      _matMult(m4) {
        const x6 = m4[0] * this.x + m4[1] * this.y, y6 = m4[2] * this.x + m4[3] * this.y;
        this.x = x6;
        this.y = y6;
        return this;
      },
      /** @param {Point} p */
      _add(p4) {
        this.x += p4.x;
        this.y += p4.y;
        return this;
      },
      /** @param {Point} p */
      _sub(p4) {
        this.x -= p4.x;
        this.y -= p4.y;
        return this;
      },
      /** @param {number} k */
      _mult(k5) {
        this.x *= k5;
        this.y *= k5;
        return this;
      },
      /** @param {number} k */
      _div(k5) {
        this.x /= k5;
        this.y /= k5;
        return this;
      },
      /** @param {Point} p */
      _multByPoint(p4) {
        this.x *= p4.x;
        this.y *= p4.y;
        return this;
      },
      /** @param {Point} p */
      _divByPoint(p4) {
        this.x /= p4.x;
        this.y /= p4.y;
        return this;
      },
      _unit() {
        this._div(this.mag());
        return this;
      },
      _perp() {
        const y6 = this.y;
        this.y = this.x;
        this.x = -y6;
        return this;
      },
      /** @param {number} angle */
      _rotate(angle) {
        const cos = Math.cos(angle), sin = Math.sin(angle), x6 = cos * this.x - sin * this.y, y6 = sin * this.x + cos * this.y;
        this.x = x6;
        this.y = y6;
        return this;
      },
      /**
       * @param {number} angle
       * @param {Point} p
       */
      _rotateAround(angle, p4) {
        const cos = Math.cos(angle), sin = Math.sin(angle), x6 = p4.x + cos * (this.x - p4.x) - sin * (this.y - p4.y), y6 = p4.y + sin * (this.x - p4.x) + cos * (this.y - p4.y);
        this.x = x6;
        this.y = y6;
        return this;
      },
      _round() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        return this;
      },
      constructor: Point
    };
    Point.convert = function(p4) {
      if (p4 instanceof Point) {
        return (
          /** @type {Point} */
          p4
        );
      }
      if (Array.isArray(p4)) {
        return new Point(+p4[0], +p4[1]);
      }
      if (p4.x !== void 0 && p4.y !== void 0) {
        return new Point(+p4.x, +p4.y);
      }
      throw new Error("Expected [x, y] or {x, y} point format");
    };
  }
});

// node_modules/@mapbox/vector-tile/index.js
var vector_tile_exports = {};
__export(vector_tile_exports, {
  VectorTile: () => VectorTile,
  VectorTileFeature: () => VectorTileFeature,
  VectorTileLayer: () => VectorTileLayer,
  classifyRings: () => classifyRings
});
function classifyRings(rings) {
  const len = rings.length;
  if (len <= 1) return [rings];
  const polygons = [];
  let polygon, ccw;
  for (let i3 = 0; i3 < len; i3++) {
    const area = signedArea(rings[i3]);
    if (area === 0) continue;
    if (ccw === void 0) ccw = area < 0;
    if (ccw === area < 0) {
      if (polygon) polygons.push(polygon);
      polygon = [rings[i3]];
    } else if (polygon) {
      polygon.push(rings[i3]);
    }
  }
  if (polygon) polygons.push(polygon);
  return polygons;
}
function signedArea(ring) {
  let sum = 0;
  for (let i3 = 0, len = ring.length, j5 = len - 1, p1, p22; i3 < len; j5 = i3++) {
    p1 = ring[i3];
    p22 = ring[j5];
    sum += (p22.x - p1.x) * (p1.y + p22.y);
  }
  return sum;
}
function readValueMessage(pbf) {
  let value = null;
  const end = pbf.readVarint() + pbf.pos;
  while (pbf.pos < end) {
    const tag = pbf.readVarint();
    value = tag === 10 ? pbf.readString() : tag === 21 ? pbf.readFloat() : tag === 25 ? pbf.readDouble() : tag === 32 ? pbf.readVarint64() : tag === 40 ? pbf.readVarint() : tag === 48 ? pbf.readSVarint() : tag === 56 ? pbf.readBoolean() : (pbf.skip(tag), null);
  }
  if (value == null) {
    throw new Error("unknown feature value");
  }
  return value;
}
var VectorTileFeature, VectorTileLayer, VectorTile;
var init_vector_tile = __esm({
  "node_modules/@mapbox/vector-tile/index.js"() {
    init_point_geometry();
    VectorTileFeature = class {
      /**
       * @param {Pbf} pbf
       * @param {number} end
       * @param {number} extent
       * @param {string[]} keys
       * @param {(number | string | boolean)[]} values
       */
      constructor(pbf, end, extent, keys, values) {
        this.properties = /* @__PURE__ */ Object.create(null);
        this.extent = extent;
        this.type = 0;
        this.id = void 0;
        this._pbf = pbf;
        this._geometry = -1;
        this._keys = keys;
        this._values = values;
        while (pbf.pos < end) {
          const tag = pbf.readVarint();
          if (tag === 8) this.id = pbf.readVarint();
          else if (tag === 18) {
            const tagsEnd = pbf.readVarint() + pbf.pos;
            while (pbf.pos < tagsEnd) {
              const key = keys[pbf.readVarint()];
              const value = values[pbf.readVarint()];
              this.properties[key] = value;
            }
          } else if (tag === 24) this.type = /** @type {0 | 1 | 2 | 3} */
          pbf.readVarint();
          else if (tag === 34) {
            this._geometry = pbf.pos;
            pbf.skip(tag);
          } else pbf.skip(tag);
        }
      }
      loadGeometry() {
        if (this._geometry < 0) throw new Error("feature has no geometry");
        const pbf = this._pbf;
        pbf.pos = this._geometry;
        const end = pbf.readVarint() + pbf.pos;
        const lines = [];
        let line;
        let cmd = 1;
        let length = 0;
        let x6 = 0;
        let y6 = 0;
        while (pbf.pos < end) {
          if (length <= 0) {
            const cmdLen = pbf.readVarint();
            cmd = cmdLen & 7;
            length = cmdLen >> 3;
            if (length === 0) continue;
          }
          length--;
          if (cmd === 1) {
            x6 += pbf.readSVarint();
            y6 += pbf.readSVarint();
            if (line) lines.push(line);
            line = [new Point(x6, y6)];
          } else if (cmd === 2) {
            x6 += pbf.readSVarint();
            y6 += pbf.readSVarint();
            if (line) line.push(new Point(x6, y6));
          } else if (cmd === 7) {
            if (line) {
              line.push(line[0].clone());
            }
          } else {
            throw new Error(`unknown command ${cmd}`);
          }
        }
        if (line) lines.push(line);
        return lines;
      }
      bbox() {
        if (this._geometry < 0) throw new Error("feature has no geometry");
        const pbf = this._pbf;
        pbf.pos = this._geometry;
        const end = pbf.readVarint() + pbf.pos;
        let cmd = 1, length = 0, x6 = 0, y6 = 0, x1 = Infinity, x22 = -Infinity, y1 = Infinity, y22 = -Infinity;
        while (pbf.pos < end) {
          if (length <= 0) {
            const cmdLen = pbf.readVarint();
            cmd = cmdLen & 7;
            length = cmdLen >> 3;
            if (length === 0) continue;
          }
          length--;
          if (cmd === 1 || cmd === 2) {
            x6 += pbf.readSVarint();
            y6 += pbf.readSVarint();
            if (x6 < x1) x1 = x6;
            if (x6 > x22) x22 = x6;
            if (y6 < y1) y1 = y6;
            if (y6 > y22) y22 = y6;
          } else if (cmd !== 7) {
            throw new Error(`unknown command ${cmd}`);
          }
        }
        return [x1, y1, x22, y22];
      }
      /**
       * @param {number} x
       * @param {number} y
       * @param {number} z
       * @return {Feature}
       */
      toGeoJSON(x6, y6, z5) {
        const size = this.extent * Math.pow(2, z5), x0 = this.extent * x6, y0 = this.extent * y6, vtCoords = this.loadGeometry();
        function projectPoint(p4) {
          return [
            (p4.x + x0) * 360 / size - 180,
            360 / Math.PI * Math.atan(Math.exp((1 - (p4.y + y0) * 2 / size) * Math.PI)) - 90
          ];
        }
        function projectLine(line) {
          return line.map(projectPoint);
        }
        let geometry;
        if (this.type === 1) {
          const points = [];
          for (const line of vtCoords) {
            points.push(line[0]);
          }
          const coordinates = projectLine(points);
          geometry = points.length === 1 ? { type: "Point", coordinates: coordinates[0] } : { type: "MultiPoint", coordinates };
        } else if (this.type === 2) {
          const coordinates = vtCoords.map(projectLine);
          geometry = coordinates.length === 1 ? { type: "LineString", coordinates: coordinates[0] } : { type: "MultiLineString", coordinates };
        } else if (this.type === 3) {
          const polygons = classifyRings(vtCoords);
          const coordinates = [];
          for (const polygon of polygons) {
            coordinates.push(polygon.map(projectLine));
          }
          geometry = coordinates.length === 1 ? { type: "Polygon", coordinates: coordinates[0] } : { type: "MultiPolygon", coordinates };
        } else {
          throw new Error("unknown feature type");
        }
        const result = {
          type: "Feature",
          geometry,
          properties: this.properties
        };
        if (this.id != null) {
          result.id = this.id;
        }
        return result;
      }
    };
    VectorTileFeature.types = ["Unknown", "Point", "LineString", "Polygon"];
    VectorTileLayer = class {
      /**
       * @param {Pbf} pbf
       * @param {number} [end]
       */
      constructor(pbf, end) {
        this.version = 1;
        this.name = "";
        this.extent = 4096;
        this.length = 0;
        this._pbf = pbf;
        this._keys = [];
        this._values = [];
        this._features = [];
        if (end === void 0) end = pbf.length;
        while (pbf.pos < end) {
          const tag = pbf.readVarint();
          if (tag === 10) this.name = pbf.readString();
          else if (tag === 18) {
            this._features.push(pbf.pos);
            pbf.skip(tag);
          } else if (tag === 26) this._keys.push(pbf.readString());
          else if (tag === 34) this._values.push(readValueMessage(pbf));
          else if (tag === 40) this.extent = pbf.readVarint();
          else if (tag === 120) this.version = pbf.readVarint();
          else pbf.skip(tag);
        }
        this.length = this._features.length;
      }
      /** return feature `i` from this layer as a `VectorTileFeature`
       * @param {number} i
       */
      feature(i3) {
        if (i3 < 0 || i3 >= this._features.length) throw new Error("feature index out of bounds");
        this._pbf.pos = this._features[i3];
        const end = this._pbf.readVarint() + this._pbf.pos;
        return new VectorTileFeature(this._pbf, end, this.extent, this._keys, this._values);
      }
    };
    VectorTile = class {
      /**
       * @param {Pbf} pbf
       * @param {number} [end]
       */
      constructor(pbf, end = pbf.length) {
        const layers = /* @__PURE__ */ Object.create(null);
        while (pbf.pos < end) {
          const tag = pbf.readVarint();
          if (tag === 26) {
            const layer = new VectorTileLayer(pbf, pbf.readVarint() + pbf.pos);
            if (layer.length) layers[layer.name] = layer;
          } else pbf.skip(tag);
        }
        this.layers = layers;
      }
    };
  }
});

// node_modules/pbf/index.js
var pbf_exports = {};
__export(pbf_exports, {
  default: () => Pbf
});
function readVarintRemainder(l3, s3, p4) {
  const buf = p4.buf;
  let h5, b6;
  b6 = buf[p4.pos++];
  h5 = (b6 & 112) >> 4;
  if (b6 < 128) return toNum(l3, h5, s3);
  b6 = buf[p4.pos++];
  h5 |= (b6 & 127) << 3;
  if (b6 < 128) return toNum(l3, h5, s3);
  b6 = buf[p4.pos++];
  h5 |= (b6 & 127) << 10;
  if (b6 < 128) return toNum(l3, h5, s3);
  b6 = buf[p4.pos++];
  h5 |= (b6 & 127) << 17;
  if (b6 < 128) return toNum(l3, h5, s3);
  b6 = buf[p4.pos++];
  h5 |= (b6 & 127) << 24;
  if (b6 < 128) return toNum(l3, h5, s3);
  b6 = buf[p4.pos++];
  h5 |= (b6 & 1) << 31;
  if (b6 < 128) return toNum(l3, h5, s3);
  throw new Error("Expected varint not more than 10 bytes");
}
function toNum(low, high, isSigned) {
  return isSigned ? high * 4294967296 + (low >>> 0) : (high >>> 0) * 4294967296 + (low >>> 0);
}
function writeBigVarint(val, pbf) {
  let low, high;
  if (val >= 0) {
    low = val % 4294967296 | 0;
    high = val / 4294967296 | 0;
  } else {
    low = ~(-val % 4294967296);
    high = ~(-val / 4294967296);
    if (low ^ 4294967295) {
      low = low + 1 | 0;
    } else {
      low = 0;
      high = high + 1 | 0;
    }
  }
  if (val >= 18446744073709552e3 || val < -18446744073709552e3) {
    throw new Error("Given varint doesn't fit into 10 bytes");
  }
  pbf.realloc(10);
  writeBigVarintLow(low, high, pbf);
  writeBigVarintHigh(high, pbf);
}
function writeBigVarintLow(low, high, pbf) {
  pbf.buf[pbf.pos++] = low & 127 | 128;
  low >>>= 7;
  pbf.buf[pbf.pos++] = low & 127 | 128;
  low >>>= 7;
  pbf.buf[pbf.pos++] = low & 127 | 128;
  low >>>= 7;
  pbf.buf[pbf.pos++] = low & 127 | 128;
  low >>>= 7;
  pbf.buf[pbf.pos] = low & 127;
}
function writeBigVarintHigh(high, pbf) {
  const lsb = (high & 7) << 4;
  pbf.buf[pbf.pos++] |= lsb | ((high >>>= 3) ? 128 : 0);
  if (!high) return;
  pbf.buf[pbf.pos++] = high & 127 | ((high >>>= 7) ? 128 : 0);
  if (!high) return;
  pbf.buf[pbf.pos++] = high & 127 | ((high >>>= 7) ? 128 : 0);
  if (!high) return;
  pbf.buf[pbf.pos++] = high & 127 | ((high >>>= 7) ? 128 : 0);
  if (!high) return;
  pbf.buf[pbf.pos++] = high & 127 | ((high >>>= 7) ? 128 : 0);
  if (!high) return;
  pbf.buf[pbf.pos++] = high & 127;
}
function makeRoomForExtraLength(startPos, len, pbf) {
  const extraLen = len <= 16383 ? 1 : len <= 2097151 ? 2 : len <= 268435455 ? 3 : Math.floor(Math.log(len) / (Math.LN2 * 7));
  pbf.realloc(extraLen);
  for (let i3 = pbf.pos - 1; i3 >= startPos; i3--) pbf.buf[i3 + extraLen] = pbf.buf[i3];
}
function writePackedVarint(arr, pbf) {
  for (let i3 = 0; i3 < arr.length; i3++) pbf.writeVarint(arr[i3]);
}
function writePackedSVarint(arr, pbf) {
  for (let i3 = 0; i3 < arr.length; i3++) pbf.writeSVarint(arr[i3]);
}
function writePackedFloat(arr, pbf) {
  for (let i3 = 0; i3 < arr.length; i3++) pbf.writeFloat(arr[i3]);
}
function writePackedDouble(arr, pbf) {
  for (let i3 = 0; i3 < arr.length; i3++) pbf.writeDouble(arr[i3]);
}
function writePackedBoolean(arr, pbf) {
  for (let i3 = 0; i3 < arr.length; i3++) pbf.writeBoolean(arr[i3]);
}
function writePackedFixed32(arr, pbf) {
  for (let i3 = 0; i3 < arr.length; i3++) pbf.writeFixed32(arr[i3]);
}
function writePackedSFixed32(arr, pbf) {
  for (let i3 = 0; i3 < arr.length; i3++) pbf.writeSFixed32(arr[i3]);
}
function writePackedFixed64(arr, pbf) {
  for (let i3 = 0; i3 < arr.length; i3++) pbf.writeFixed64(arr[i3]);
}
function writePackedSFixed64(arr, pbf) {
  for (let i3 = 0; i3 < arr.length; i3++) pbf.writeSFixed64(arr[i3]);
}
function readUtf8(buf, pos, end) {
  let str = "";
  let i3 = pos;
  while (i3 < end) {
    const b0 = buf[i3];
    let c3 = null;
    let bytesPerSequence = b0 > 239 ? 4 : b0 > 223 ? 3 : b0 > 191 ? 2 : 1;
    if (i3 + bytesPerSequence > end) break;
    let b1, b22, b32;
    if (bytesPerSequence === 1) {
      if (b0 < 128) {
        c3 = b0;
      }
    } else if (bytesPerSequence === 2) {
      b1 = buf[i3 + 1];
      if ((b1 & 192) === 128) {
        c3 = (b0 & 31) << 6 | b1 & 63;
        if (c3 <= 127) {
          c3 = null;
        }
      }
    } else if (bytesPerSequence === 3) {
      b1 = buf[i3 + 1];
      b22 = buf[i3 + 2];
      if ((b1 & 192) === 128 && (b22 & 192) === 128) {
        c3 = (b0 & 15) << 12 | (b1 & 63) << 6 | b22 & 63;
        if (c3 <= 2047 || c3 >= 55296 && c3 <= 57343) {
          c3 = null;
        }
      }
    } else if (bytesPerSequence === 4) {
      b1 = buf[i3 + 1];
      b22 = buf[i3 + 2];
      b32 = buf[i3 + 3];
      if ((b1 & 192) === 128 && (b22 & 192) === 128 && (b32 & 192) === 128) {
        c3 = (b0 & 15) << 18 | (b1 & 63) << 12 | (b22 & 63) << 6 | b32 & 63;
        if (c3 <= 65535 || c3 >= 1114112) {
          c3 = null;
        }
      }
    }
    if (c3 === null) {
      c3 = 65533;
      bytesPerSequence = 1;
    } else if (c3 > 65535) {
      c3 -= 65536;
      str += String.fromCharCode(c3 >>> 10 & 1023 | 55296);
      c3 = 56320 | c3 & 1023;
    }
    str += String.fromCharCode(c3);
    i3 += bytesPerSequence;
  }
  return str;
}
function writeUtf8(buf, str, pos) {
  for (let i3 = 0, c3, lead; i3 < str.length; i3++) {
    c3 = str.charCodeAt(i3);
    if (c3 > 55295 && c3 < 57344) {
      if (lead) {
        if (c3 < 56320) {
          buf[pos++] = 239;
          buf[pos++] = 191;
          buf[pos++] = 189;
          lead = c3;
          continue;
        } else {
          c3 = lead - 55296 << 10 | c3 - 56320 | 65536;
          lead = null;
        }
      } else {
        if (c3 > 56319 || i3 + 1 === str.length) {
          buf[pos++] = 239;
          buf[pos++] = 191;
          buf[pos++] = 189;
        } else {
          lead = c3;
        }
        continue;
      }
    } else if (lead) {
      buf[pos++] = 239;
      buf[pos++] = 191;
      buf[pos++] = 189;
      lead = null;
    }
    if (c3 < 128) {
      buf[pos++] = c3;
    } else {
      if (c3 < 2048) {
        buf[pos++] = c3 >> 6 | 192;
      } else {
        if (c3 < 65536) {
          buf[pos++] = c3 >> 12 | 224;
        } else {
          buf[pos++] = c3 >> 18 | 240;
          buf[pos++] = c3 >> 12 & 63 | 128;
        }
        buf[pos++] = c3 >> 6 & 63 | 128;
      }
      buf[pos++] = c3 & 63 | 128;
    }
  }
  return pos;
}
var SHIFT_LEFT_32, SHIFT_RIGHT_32, TEXT_DECODER_MIN_LENGTH, utf8TextDecoder, PBF_VARINT, PBF_FIXED64, PBF_BYTES, PBF_FIXED32, Pbf;
var init_pbf = __esm({
  "node_modules/pbf/index.js"() {
    SHIFT_LEFT_32 = (1 << 16) * (1 << 16);
    SHIFT_RIGHT_32 = 1 / SHIFT_LEFT_32;
    TEXT_DECODER_MIN_LENGTH = 12;
    utf8TextDecoder = typeof TextDecoder === "undefined" ? null : new TextDecoder("utf-8");
    PBF_VARINT = 0;
    PBF_FIXED64 = 1;
    PBF_BYTES = 2;
    PBF_FIXED32 = 5;
    Pbf = class {
      /**
       * @param {Uint8Array | ArrayBuffer} [buf]
       */
      constructor(buf = new Uint8Array(16)) {
        this.buf = ArrayBuffer.isView(buf) ? buf : new Uint8Array(buf);
        this.dataView = new DataView(this.buf.buffer);
        this.pos = 0;
        this.type = 0;
        this.length = this.buf.length;
      }
      // === READING =================================================================
      /**
       * @template T
       * @param {(tag: number, result: T, pbf: Pbf) => void} readField
       * @param {T} result
       * @param {number} [end]
       */
      readFields(readField, result, end = this.length) {
        while (this.pos < end) {
          const val = this.readVarint(), tag = val >> 3, startPos = this.pos;
          this.type = val & 7;
          readField(tag, result, this);
          if (this.pos === startPos) this.skip(val);
        }
        return result;
      }
      /**
       * @template T
       * @param {(tag: number, result: T, pbf: Pbf) => void} readField
       * @param {T} result
       */
      readMessage(readField, result) {
        return this.readFields(readField, result, this.readVarint() + this.pos);
      }
      readFixed32() {
        const val = this.dataView.getUint32(this.pos, true);
        this.pos += 4;
        return val;
      }
      readSFixed32() {
        const val = this.dataView.getInt32(this.pos, true);
        this.pos += 4;
        return val;
      }
      // 64-bit int handling is based on github.com/dpw/node-buffer-more-ints (MIT-licensed)
      readFixed64() {
        const val = this.dataView.getUint32(this.pos, true) + this.dataView.getUint32(this.pos + 4, true) * SHIFT_LEFT_32;
        this.pos += 8;
        return val;
      }
      readSFixed64() {
        const val = this.dataView.getUint32(this.pos, true) + this.dataView.getInt32(this.pos + 4, true) * SHIFT_LEFT_32;
        this.pos += 8;
        return val;
      }
      readFloat() {
        const val = this.dataView.getFloat32(this.pos, true);
        this.pos += 4;
        return val;
      }
      readDouble() {
        const val = this.dataView.getFloat64(this.pos, true);
        this.pos += 8;
        return val;
      }
      /**
       * @param {boolean} [isSigned]
       */
      readVarint(isSigned) {
        const buf = this.buf;
        let val, b6;
        b6 = buf[this.pos++];
        val = b6 & 127;
        if (b6 < 128) return val;
        b6 = buf[this.pos++];
        val |= (b6 & 127) << 7;
        if (b6 < 128) return val;
        b6 = buf[this.pos++];
        val |= (b6 & 127) << 14;
        if (b6 < 128) return val;
        b6 = buf[this.pos++];
        val |= (b6 & 127) << 21;
        if (b6 < 128) return val;
        b6 = buf[this.pos];
        val |= (b6 & 15) << 28;
        return readVarintRemainder(val, isSigned, this);
      }
      readVarint64() {
        return this.readVarint(true);
      }
      readSVarint() {
        const num = this.readVarint();
        return num % 2 === 1 ? (num + 1) / -2 : num / 2;
      }
      readBoolean() {
        return Boolean(this.readVarint());
      }
      readString() {
        const end = this.readVarint() + this.pos;
        const pos = this.pos;
        this.pos = end;
        if (end - pos >= TEXT_DECODER_MIN_LENGTH && utf8TextDecoder) {
          return utf8TextDecoder.decode(this.buf.subarray(pos, end));
        }
        return readUtf8(this.buf, pos, end);
      }
      readBytes() {
        const end = this.readVarint() + this.pos, buffer = this.buf.subarray(this.pos, end);
        this.pos = end;
        return buffer;
      }
      // verbose for performance reasons; doesn't affect gzipped size
      /**
       * @param {number[]} [arr]
       * @param {boolean} [isSigned]
       */
      readPackedVarint(arr = [], isSigned) {
        const end = this.readPackedEnd();
        while (this.pos < end) arr.push(this.readVarint(isSigned));
        return arr;
      }
      /** @param {number[]} [arr] */
      readPackedSVarint(arr = []) {
        const end = this.readPackedEnd();
        while (this.pos < end) arr.push(this.readSVarint());
        return arr;
      }
      /** @param {boolean[]} [arr] */
      readPackedBoolean(arr = []) {
        const end = this.readPackedEnd();
        while (this.pos < end) arr.push(this.readBoolean());
        return arr;
      }
      /** @param {number[]} [arr] */
      readPackedFloat(arr = []) {
        const end = this.readPackedEnd();
        while (this.pos < end) arr.push(this.readFloat());
        return arr;
      }
      /** @param {number[]} [arr] */
      readPackedDouble(arr = []) {
        const end = this.readPackedEnd();
        while (this.pos < end) arr.push(this.readDouble());
        return arr;
      }
      /** @param {number[]} [arr] */
      readPackedFixed32(arr = []) {
        const end = this.readPackedEnd();
        while (this.pos < end) arr.push(this.readFixed32());
        return arr;
      }
      /** @param {number[]} [arr] */
      readPackedSFixed32(arr = []) {
        const end = this.readPackedEnd();
        while (this.pos < end) arr.push(this.readSFixed32());
        return arr;
      }
      /** @param {number[]} [arr] */
      readPackedFixed64(arr = []) {
        const end = this.readPackedEnd();
        while (this.pos < end) arr.push(this.readFixed64());
        return arr;
      }
      /** @param {number[]} [arr] */
      readPackedSFixed64(arr = []) {
        const end = this.readPackedEnd();
        while (this.pos < end) arr.push(this.readSFixed64());
        return arr;
      }
      readPackedEnd() {
        return this.type === PBF_BYTES ? this.readVarint() + this.pos : this.pos + 1;
      }
      /** @param {number} val */
      skip(val) {
        const type = val & 7;
        if (type === PBF_VARINT) while (this.buf[this.pos++] > 127) {
        }
        else if (type === PBF_BYTES) this.pos = this.readVarint() + this.pos;
        else if (type === PBF_FIXED32) this.pos += 4;
        else if (type === PBF_FIXED64) this.pos += 8;
        else throw new Error(`Unimplemented type: ${type}`);
      }
      // === WRITING =================================================================
      /**
       * @param {number} tag
       * @param {number} type
       */
      writeTag(tag, type) {
        this.writeVarint(tag << 3 | type);
      }
      /** @param {number} min */
      realloc(min) {
        let length = this.length || 16;
        while (length < this.pos + min) length *= 2;
        if (length !== this.length) {
          const buf = new Uint8Array(length);
          buf.set(this.buf);
          this.buf = buf;
          this.dataView = new DataView(buf.buffer);
          this.length = length;
        }
      }
      finish() {
        this.length = this.pos;
        this.pos = 0;
        return this.buf.subarray(0, this.length);
      }
      /** @param {number} val */
      writeFixed32(val) {
        this.realloc(4);
        this.dataView.setInt32(this.pos, val, true);
        this.pos += 4;
      }
      /** @param {number} val */
      writeSFixed32(val) {
        this.realloc(4);
        this.dataView.setInt32(this.pos, val, true);
        this.pos += 4;
      }
      /** @param {number} val */
      writeFixed64(val) {
        this.realloc(8);
        this.dataView.setInt32(this.pos, val & -1, true);
        this.dataView.setInt32(this.pos + 4, Math.floor(val * SHIFT_RIGHT_32), true);
        this.pos += 8;
      }
      /** @param {number} val */
      writeSFixed64(val) {
        this.realloc(8);
        this.dataView.setInt32(this.pos, val & -1, true);
        this.dataView.setInt32(this.pos + 4, Math.floor(val * SHIFT_RIGHT_32), true);
        this.pos += 8;
      }
      /** @param {number} val */
      writeVarint(val) {
        val = +val || 0;
        if (val > 268435455 || val < 0) {
          writeBigVarint(val, this);
          return;
        }
        this.realloc(4);
        this.buf[this.pos++] = val & 127 | (val > 127 ? 128 : 0);
        if (val <= 127) return;
        this.buf[this.pos++] = (val >>>= 7) & 127 | (val > 127 ? 128 : 0);
        if (val <= 127) return;
        this.buf[this.pos++] = (val >>>= 7) & 127 | (val > 127 ? 128 : 0);
        if (val <= 127) return;
        this.buf[this.pos++] = val >>> 7 & 127;
      }
      /** @param {number} val */
      writeSVarint(val) {
        this.writeVarint(val < 0 ? -val * 2 - 1 : val * 2);
      }
      /** @param {boolean} val */
      writeBoolean(val) {
        this.writeVarint(+val);
      }
      /** @param {string} str */
      writeString(str) {
        str = String(str);
        this.realloc(str.length * 4);
        this.pos++;
        const startPos = this.pos;
        this.pos = writeUtf8(this.buf, str, this.pos);
        const len = this.pos - startPos;
        if (len >= 128) makeRoomForExtraLength(startPos, len, this);
        this.pos = startPos - 1;
        this.writeVarint(len);
        this.pos += len;
      }
      /** @param {number} val */
      writeFloat(val) {
        this.realloc(4);
        this.dataView.setFloat32(this.pos, val, true);
        this.pos += 4;
      }
      /** @param {number} val */
      writeDouble(val) {
        this.realloc(8);
        this.dataView.setFloat64(this.pos, val, true);
        this.pos += 8;
      }
      /** @param {Uint8Array} buffer */
      writeBytes(buffer) {
        const len = buffer.length;
        this.writeVarint(len);
        this.realloc(len);
        for (let i3 = 0; i3 < len; i3++) this.buf[this.pos++] = buffer[i3];
      }
      /**
       * @template T
       * @param {(obj: T, pbf: Pbf) => void} fn
       * @param {T} obj
       */
      writeRawMessage(fn3, obj) {
        this.pos++;
        const startPos = this.pos;
        fn3(obj, this);
        const len = this.pos - startPos;
        if (len >= 128) makeRoomForExtraLength(startPos, len, this);
        this.pos = startPos - 1;
        this.writeVarint(len);
        this.pos += len;
      }
      /**
       * @template T
       * @param {number} tag
       * @param {(obj: T, pbf: Pbf) => void} fn
       * @param {T} obj
       */
      writeMessage(tag, fn3, obj) {
        this.writeTag(tag, PBF_BYTES);
        this.writeRawMessage(fn3, obj);
      }
      /**
       * @param {number} tag
       * @param {number[]} arr
       */
      writePackedVarint(tag, arr) {
        if (arr.length) this.writeMessage(tag, writePackedVarint, arr);
      }
      /**
       * @param {number} tag
       * @param {number[]} arr
       */
      writePackedSVarint(tag, arr) {
        if (arr.length) this.writeMessage(tag, writePackedSVarint, arr);
      }
      /**
       * @param {number} tag
       * @param {boolean[]} arr
       */
      writePackedBoolean(tag, arr) {
        if (arr.length) this.writeMessage(tag, writePackedBoolean, arr);
      }
      /**
       * @param {number} tag
       * @param {number[]} arr
       */
      writePackedFloat(tag, arr) {
        if (arr.length) this.writeMessage(tag, writePackedFloat, arr);
      }
      /**
       * @param {number} tag
       * @param {number[]} arr
       */
      writePackedDouble(tag, arr) {
        if (arr.length) this.writeMessage(tag, writePackedDouble, arr);
      }
      /**
       * @param {number} tag
       * @param {number[]} arr
       */
      writePackedFixed32(tag, arr) {
        if (arr.length) this.writeMessage(tag, writePackedFixed32, arr);
      }
      /**
       * @param {number} tag
       * @param {number[]} arr
       */
      writePackedSFixed32(tag, arr) {
        if (arr.length) this.writeMessage(tag, writePackedSFixed32, arr);
      }
      /**
       * @param {number} tag
       * @param {number[]} arr
       */
      writePackedFixed64(tag, arr) {
        if (arr.length) this.writeMessage(tag, writePackedFixed64, arr);
      }
      /**
       * @param {number} tag
       * @param {number[]} arr
       */
      writePackedSFixed64(tag, arr) {
        if (arr.length) this.writeMessage(tag, writePackedSFixed64, arr);
      }
      /**
       * @param {number} tag
       * @param {Uint8Array} buffer
       */
      writeBytesField(tag, buffer) {
        this.writeTag(tag, PBF_BYTES);
        this.writeBytes(buffer);
      }
      /**
       * @param {number} tag
       * @param {number} val
       */
      writeFixed32Field(tag, val) {
        this.writeTag(tag, PBF_FIXED32);
        this.writeFixed32(val);
      }
      /**
       * @param {number} tag
       * @param {number} val
       */
      writeSFixed32Field(tag, val) {
        this.writeTag(tag, PBF_FIXED32);
        this.writeSFixed32(val);
      }
      /**
       * @param {number} tag
       * @param {number} val
       */
      writeFixed64Field(tag, val) {
        this.writeTag(tag, PBF_FIXED64);
        this.writeFixed64(val);
      }
      /**
       * @param {number} tag
       * @param {number} val
       */
      writeSFixed64Field(tag, val) {
        this.writeTag(tag, PBF_FIXED64);
        this.writeSFixed64(val);
      }
      /**
       * @param {number} tag
       * @param {number} val
       */
      writeVarintField(tag, val) {
        this.writeTag(tag, PBF_VARINT);
        this.writeVarint(val);
      }
      /**
       * @param {number} tag
       * @param {number} val
       */
      writeSVarintField(tag, val) {
        this.writeTag(tag, PBF_VARINT);
        this.writeSVarint(val);
      }
      /**
       * @param {number} tag
       * @param {string} str
       */
      writeStringField(tag, str) {
        this.writeTag(tag, PBF_BYTES);
        this.writeString(str);
      }
      /**
       * @param {number} tag
       * @param {number} val
       */
      writeFloatField(tag, val) {
        this.writeTag(tag, PBF_FIXED32);
        this.writeFloat(val);
      }
      /**
       * @param {number} tag
       * @param {number} val
       */
      writeDoubleField(tag, val) {
        this.writeTag(tag, PBF_FIXED64);
        this.writeDouble(val);
      }
      /**
       * @param {number} tag
       * @param {boolean} val
       */
      writeBooleanField(tag, val) {
        this.writeVarintField(tag, +val);
      }
    };
  }
});

// node_modules/fflate/esm/browser.js
function inflateSync(data, opts) {
  return inflt(data, { i: 2 }, opts && opts.out, opts && opts.dictionary);
}
function gunzipSync(data, opts) {
  var st3 = gzs(data);
  if (st3 + 8 > data.length)
    err(6, "invalid gzip data");
  return inflt(data.subarray(st3, -8), { i: 2 }, opts && opts.out || new u8(gzl(data)), opts && opts.dictionary);
}
function unzlibSync(data, opts) {
  return inflt(data.subarray(zls(data, opts && opts.dictionary), -4), { i: 2 }, opts && opts.out, opts && opts.dictionary);
}
function decompressSync(data, opts) {
  return data[0] == 31 && data[1] == 139 && data[2] == 8 ? gunzipSync(data, opts) : (data[0] & 15) != 8 || data[0] >> 4 > 7 || (data[0] << 8 | data[1]) % 31 ? inflateSync(data, opts) : unzlibSync(data, opts);
}
var u8, u16, i32, fleb, fdeb, clim, freb, _a2, fl, revfl, _b, fd, revfd, rev, x6, i3, hMap, flt, i3, i3, i3, i3, fdt, i3, flrm, fdrm, max, bits, bits16, shft, slc, ec, err, inflt, et2, gzs, gzl, zls, td, tds;
var init_browser = __esm({
  "node_modules/fflate/esm/browser.js"() {
    u8 = Uint8Array;
    u16 = Uint16Array;
    i32 = Int32Array;
    fleb = new u8([
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      1,
      1,
      2,
      2,
      2,
      2,
      3,
      3,
      3,
      3,
      4,
      4,
      4,
      4,
      5,
      5,
      5,
      5,
      0,
      /* unused */
      0,
      0,
      /* impossible */
      0
    ]);
    fdeb = new u8([
      0,
      0,
      0,
      0,
      1,
      1,
      2,
      2,
      3,
      3,
      4,
      4,
      5,
      5,
      6,
      6,
      7,
      7,
      8,
      8,
      9,
      9,
      10,
      10,
      11,
      11,
      12,
      12,
      13,
      13,
      /* unused */
      0,
      0
    ]);
    clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
    freb = function(eb, start) {
      var b6 = new u16(31);
      for (var i3 = 0; i3 < 31; ++i3) {
        b6[i3] = start += 1 << eb[i3 - 1];
      }
      var r2 = new i32(b6[30]);
      for (var i3 = 1; i3 < 30; ++i3) {
        for (var j5 = b6[i3]; j5 < b6[i3 + 1]; ++j5) {
          r2[j5] = j5 - b6[i3] << 5 | i3;
        }
      }
      return { b: b6, r: r2 };
    };
    _a2 = freb(fleb, 2);
    fl = _a2.b;
    revfl = _a2.r;
    fl[28] = 258, revfl[258] = 28;
    _b = freb(fdeb, 0);
    fd = _b.b;
    revfd = _b.r;
    rev = new u16(32768);
    for (i3 = 0; i3 < 32768; ++i3) {
      x6 = (i3 & 43690) >> 1 | (i3 & 21845) << 1;
      x6 = (x6 & 52428) >> 2 | (x6 & 13107) << 2;
      x6 = (x6 & 61680) >> 4 | (x6 & 3855) << 4;
      rev[i3] = ((x6 & 65280) >> 8 | (x6 & 255) << 8) >> 1;
    }
    hMap = function(cd, mb, r2) {
      var s3 = cd.length;
      var i3 = 0;
      var l3 = new u16(mb);
      for (; i3 < s3; ++i3) {
        if (cd[i3])
          ++l3[cd[i3] - 1];
      }
      var le4 = new u16(mb);
      for (i3 = 1; i3 < mb; ++i3) {
        le4[i3] = le4[i3 - 1] + l3[i3 - 1] << 1;
      }
      var co2;
      if (r2) {
        co2 = new u16(1 << mb);
        var rvb = 15 - mb;
        for (i3 = 0; i3 < s3; ++i3) {
          if (cd[i3]) {
            var sv = i3 << 4 | cd[i3];
            var r_1 = mb - cd[i3];
            var v6 = le4[cd[i3] - 1]++ << r_1;
            for (var m4 = v6 | (1 << r_1) - 1; v6 <= m4; ++v6) {
              co2[rev[v6] >> rvb] = sv;
            }
          }
        }
      } else {
        co2 = new u16(s3);
        for (i3 = 0; i3 < s3; ++i3) {
          if (cd[i3]) {
            co2[i3] = rev[le4[cd[i3] - 1]++] >> 15 - cd[i3];
          }
        }
      }
      return co2;
    };
    flt = new u8(288);
    for (i3 = 0; i3 < 144; ++i3)
      flt[i3] = 8;
    for (i3 = 144; i3 < 256; ++i3)
      flt[i3] = 9;
    for (i3 = 256; i3 < 280; ++i3)
      flt[i3] = 7;
    for (i3 = 280; i3 < 288; ++i3)
      flt[i3] = 8;
    fdt = new u8(32);
    for (i3 = 0; i3 < 32; ++i3)
      fdt[i3] = 5;
    flrm = /* @__PURE__ */ hMap(flt, 9, 1);
    fdrm = /* @__PURE__ */ hMap(fdt, 5, 1);
    max = function(a3) {
      var m4 = a3[0];
      for (var i3 = 1; i3 < a3.length; ++i3) {
        if (a3[i3] > m4)
          m4 = a3[i3];
      }
      return m4;
    };
    bits = function(d5, p4, m4) {
      var o3 = p4 / 8 | 0;
      return (d5[o3] | d5[o3 + 1] << 8) >> (p4 & 7) & m4;
    };
    bits16 = function(d5, p4) {
      var o3 = p4 / 8 | 0;
      return (d5[o3] | d5[o3 + 1] << 8 | d5[o3 + 2] << 16) >> (p4 & 7);
    };
    shft = function(p4) {
      return (p4 + 7) / 8 | 0;
    };
    slc = function(v6, s3, e2) {
      if (s3 == null || s3 < 0)
        s3 = 0;
      if (e2 == null || e2 > v6.length)
        e2 = v6.length;
      return new u8(v6.subarray(s3, e2));
    };
    ec = [
      "unexpected EOF",
      "invalid block type",
      "invalid length/literal",
      "invalid distance",
      "stream finished",
      "no stream handler",
      ,
      // determined by compression function
      "no callback",
      "invalid UTF-8 data",
      "extra field too long",
      "date not in range 1980-2099",
      "filename too long",
      "stream finishing",
      "invalid zip data"
      // determined by unknown compression method
    ];
    err = function(ind, msg, nt3) {
      var e2 = new Error(msg || ec[ind]);
      e2.code = ind;
      if (Error.captureStackTrace)
        Error.captureStackTrace(e2, err);
      if (!nt3)
        throw e2;
      return e2;
    };
    inflt = function(dat, st3, buf, dict) {
      var sl = dat.length, dl = dict ? dict.length : 0;
      if (!sl || st3.f && !st3.l)
        return buf || new u8(0);
      var noBuf = !buf;
      var resize = noBuf || st3.i != 2;
      var noSt = st3.i;
      if (noBuf)
        buf = new u8(sl * 3);
      var cbuf = function(l4) {
        var bl = buf.length;
        if (l4 > bl) {
          var nbuf = new u8(Math.max(bl * 2, l4));
          nbuf.set(buf);
          buf = nbuf;
        }
      };
      var final = st3.f || 0, pos = st3.p || 0, bt3 = st3.b || 0, lm = st3.l, dm = st3.d, lbt = st3.m, dbt = st3.n;
      var tbts = sl * 8;
      do {
        if (!lm) {
          final = bits(dat, pos, 1);
          var type = bits(dat, pos + 1, 3);
          pos += 3;
          if (!type) {
            var s3 = shft(pos) + 4, l3 = dat[s3 - 4] | dat[s3 - 3] << 8, t2 = s3 + l3;
            if (t2 > sl) {
              if (noSt)
                err(0);
              break;
            }
            if (resize)
              cbuf(bt3 + l3);
            buf.set(dat.subarray(s3, t2), bt3);
            st3.b = bt3 += l3, st3.p = pos = t2 * 8, st3.f = final;
            continue;
          } else if (type == 1)
            lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
          else if (type == 2) {
            var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
            var tl2 = hLit + bits(dat, pos + 5, 31) + 1;
            pos += 14;
            var ldt = new u8(tl2);
            var clt = new u8(19);
            for (var i3 = 0; i3 < hcLen; ++i3) {
              clt[clim[i3]] = bits(dat, pos + i3 * 3, 7);
            }
            pos += hcLen * 3;
            var clb = max(clt), clbmsk = (1 << clb) - 1;
            var clm = hMap(clt, clb, 1);
            for (var i3 = 0; i3 < tl2; ) {
              var r2 = clm[bits(dat, pos, clbmsk)];
              pos += r2 & 15;
              var s3 = r2 >> 4;
              if (s3 < 16) {
                ldt[i3++] = s3;
              } else {
                var c3 = 0, n2 = 0;
                if (s3 == 16)
                  n2 = 3 + bits(dat, pos, 3), pos += 2, c3 = ldt[i3 - 1];
                else if (s3 == 17)
                  n2 = 3 + bits(dat, pos, 7), pos += 3;
                else if (s3 == 18)
                  n2 = 11 + bits(dat, pos, 127), pos += 7;
                while (n2--)
                  ldt[i3++] = c3;
              }
            }
            var lt3 = ldt.subarray(0, hLit), dt3 = ldt.subarray(hLit);
            lbt = max(lt3);
            dbt = max(dt3);
            lm = hMap(lt3, lbt, 1);
            dm = hMap(dt3, dbt, 1);
          } else
            err(1);
          if (pos > tbts) {
            if (noSt)
              err(0);
            break;
          }
        }
        if (resize)
          cbuf(bt3 + 131072);
        var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
        var lpos = pos;
        for (; ; lpos = pos) {
          var c3 = lm[bits16(dat, pos) & lms], sym = c3 >> 4;
          pos += c3 & 15;
          if (pos > tbts) {
            if (noSt)
              err(0);
            break;
          }
          if (!c3)
            err(2);
          if (sym < 256)
            buf[bt3++] = sym;
          else if (sym == 256) {
            lpos = pos, lm = null;
            break;
          } else {
            var add = sym - 254;
            if (sym > 264) {
              var i3 = sym - 257, b6 = fleb[i3];
              add = bits(dat, pos, (1 << b6) - 1) + fl[i3];
              pos += b6;
            }
            var d5 = dm[bits16(dat, pos) & dms], dsym = d5 >> 4;
            if (!d5)
              err(3);
            pos += d5 & 15;
            var dt3 = fd[dsym];
            if (dsym > 3) {
              var b6 = fdeb[dsym];
              dt3 += bits16(dat, pos) & (1 << b6) - 1, pos += b6;
            }
            if (pos > tbts) {
              if (noSt)
                err(0);
              break;
            }
            if (resize)
              cbuf(bt3 + 131072);
            var end = bt3 + add;
            if (bt3 < dt3) {
              var shift = dl - dt3, dend = Math.min(dt3, end);
              if (shift + bt3 < 0)
                err(3);
              for (; bt3 < dend; ++bt3)
                buf[bt3] = dict[shift + bt3];
            }
            for (; bt3 < end; ++bt3)
              buf[bt3] = buf[bt3 - dt3];
          }
        }
        st3.l = lm, st3.p = lpos, st3.b = bt3, st3.f = final;
        if (lm)
          final = 1, st3.m = lbt, st3.d = dm, st3.n = dbt;
      } while (!final);
      return bt3 != buf.length && noBuf ? slc(buf, 0, bt3) : buf.subarray(0, bt3);
    };
    et2 = /* @__PURE__ */ new u8(0);
    gzs = function(d5) {
      if (d5[0] != 31 || d5[1] != 139 || d5[2] != 8)
        err(6, "invalid gzip data");
      var flg = d5[3];
      var st3 = 10;
      if (flg & 4)
        st3 += (d5[10] | d5[11] << 8) + 2;
      for (var zs2 = (flg >> 3 & 1) + (flg >> 4 & 1); zs2 > 0; zs2 -= !d5[st3++])
        ;
      return st3 + (flg & 2);
    };
    gzl = function(d5) {
      var l3 = d5.length;
      return (d5[l3 - 4] | d5[l3 - 3] << 8 | d5[l3 - 2] << 16 | d5[l3 - 1] << 24) >>> 0;
    };
    zls = function(d5, dict) {
      if ((d5[0] & 15) != 8 || d5[0] >> 4 > 7 || (d5[0] << 8 | d5[1]) % 31)
        err(6, "invalid zlib data");
      if ((d5[1] >> 5 & 1) == +!dict)
        err(6, "invalid zlib data: " + (d5[1] & 32 ? "need" : "unexpected") + " dictionary");
      return (d5[1] >> 3 & 4) + 2;
    };
    td = typeof TextDecoder != "undefined" && /* @__PURE__ */ new TextDecoder();
    tds = 0;
    try {
      td.decode(et2, { stream: true });
      tds = 1;
    } catch (e2) {
    }
  }
});

// node_modules/pmtiles/dist/esm/index.js
var esm_exports = {};
__export(esm_exports, {
  Compression: () => J3,
  EtagMismatch: () => v4,
  FetchSource: () => E3,
  FileSource: () => k3,
  PMTiles: () => w3,
  Protocol: () => B3,
  ResolvedValueCache: () => $3,
  SharedPromiseCache: () => C3,
  TileType: () => O3,
  bytesToHeader: () => X3,
  findTile: () => Q3,
  getUint64: () => y4,
  leafletRasterLayer: () => re2,
  readVarint: () => x4,
  tileIdToZxy: () => ie3,
  tileTypeExt: () => _4,
  zxyToTileId: () => q3
});
function b4(o3, t2) {
  return (t2 >>> 0) * 4294967296 + (o3 >>> 0);
}
function N3(o3, t2) {
  let e2 = t2.buf, r2 = e2[t2.pos++], n2 = (r2 & 112) >> 4;
  if (r2 < 128 || (r2 = e2[t2.pos++], n2 |= (r2 & 127) << 3, r2 < 128) || (r2 = e2[t2.pos++], n2 |= (r2 & 127) << 10, r2 < 128) || (r2 = e2[t2.pos++], n2 |= (r2 & 127) << 17, r2 < 128) || (r2 = e2[t2.pos++], n2 |= (r2 & 127) << 24, r2 < 128) || (r2 = e2[t2.pos++], n2 |= (r2 & 1) << 31, r2 < 128)) return b4(o3, n2);
  throw new Error("Expected varint not more than 10 bytes");
}
function x4(o3) {
  let t2 = o3.buf, e2 = t2[o3.pos++], r2 = e2 & 127;
  return e2 < 128 || (e2 = t2[o3.pos++], r2 |= (e2 & 127) << 7, e2 < 128) || (e2 = t2[o3.pos++], r2 |= (e2 & 127) << 14, e2 < 128) || (e2 = t2[o3.pos++], r2 |= (e2 & 127) << 21, e2 < 128) ? r2 : (e2 = t2[o3.pos], r2 |= (e2 & 15) << 28, N3(r2, o3));
}
function I3(o3, t2, e2, r2, n2) {
  return n2 === 0 ? r2 !== 0 ? [o3 - 1 - e2, o3 - 1 - t2] : [e2, t2] : [t2, e2];
}
function q3(o3, t2, e2) {
  if (o3 > 26) throw new Error("Tile zoom level exceeds max safe number limit (26)");
  if (t2 >= 1 << o3 || e2 >= 1 << o3) throw new Error("tile x/y outside zoom level bounds");
  let r2 = ((1 << o3) * (1 << o3) - 1) / 3, n2 = o3 - 1, [s3, i3] = [t2, e2];
  for (let a3 = 1 << n2; a3 > 0; a3 >>= 1) {
    let c3 = s3 & a3, l3 = i3 & a3;
    r2 += (3 * c3 ^ l3) * (1 << n2), [s3, i3] = I3(a3, s3, i3, c3, l3), n2--;
  }
  return r2;
}
function G3(o3) {
  let t2 = 3 * o3 + 1;
  return t2 < 4294967296 ? 31 - Math.clz32(t2) : 63 - Math.clz32(t2 / 4294967296);
}
function ie3(o3) {
  let t2 = G3(o3) >> 1;
  if (t2 > 26) throw new Error("Tile zoom level exceeds max safe number limit (26)");
  let e2 = ((1 << t2) * (1 << t2) - 1) / 3, r2 = o3 - e2, n2 = 0, s3 = 0, i3 = 1 << t2;
  for (let a3 = 1; a3 < i3; a3 <<= 1) {
    let c3 = a3 & r2 / 2, l3 = a3 & (r2 ^ c3);
    [n2, s3] = I3(a3, n2, s3, c3, l3), r2 = r2 / 2, n2 += c3, s3 += l3;
  }
  return [t2, n2, s3];
}
function P3(o3, t2) {
  return h3(this, null, function* () {
    if (t2 === 1 || t2 === 0) return o3;
    if (t2 === 2) {
      if (typeof globalThis.DecompressionStream == "undefined") return decompressSync(new Uint8Array(o3));
      let e2 = new Response(o3).body;
      if (!e2) throw new Error("Failed to read response stream");
      let r2 = e2.pipeThrough(new globalThis.DecompressionStream("gzip"));
      return new Response(r2).arrayBuffer();
    }
    throw new Error("Compression method not supported");
  });
}
function _4(o3) {
  return o3 === 1 ? ".mvt" : o3 === 2 ? ".png" : o3 === 3 ? ".jpg" : o3 === 4 ? ".webp" : o3 === 5 ? ".avif" : o3 === 6 ? ".mlt" : "";
}
function Q3(o3, t2) {
  let e2 = 0, r2 = o3.length - 1;
  for (; e2 <= r2; ) {
    let n2 = r2 + e2 >> 1, s3 = t2 - o3[n2].tileId;
    if (s3 > 0) e2 = n2 + 1;
    else if (s3 < 0) r2 = n2 - 1;
    else return o3[n2];
  }
  return r2 >= 0 && (o3[r2].runLength === 0 || t2 - o3[r2].tileId < o3[r2].runLength) ? o3[r2] : null;
}
function y4(o3, t2) {
  let e2 = o3.getUint32(t2 + 4, true), r2 = o3.getUint32(t2 + 0, true);
  return e2 * S3(2, 32) + r2;
}
function X3(o3, t2) {
  let e2 = new DataView(o3), r2 = e2.getUint8(7);
  if (r2 > 3) throw new Error(`Archive is spec version ${r2} but this library supports up to spec version 3`);
  return { specVersion: r2, rootDirectoryOffset: y4(e2, 8), rootDirectoryLength: y4(e2, 16), jsonMetadataOffset: y4(e2, 24), jsonMetadataLength: y4(e2, 32), leafDirectoryOffset: y4(e2, 40), leafDirectoryLength: y4(e2, 48), tileDataOffset: y4(e2, 56), tileDataLength: y4(e2, 64), numAddressedTiles: y4(e2, 72), numTileEntries: y4(e2, 80), numTileContents: y4(e2, 88), clustered: e2.getUint8(96) === 1, internalCompression: e2.getUint8(97), tileCompression: e2.getUint8(98), tileType: e2.getUint8(99), minZoom: e2.getUint8(100), maxZoom: e2.getUint8(101), minLon: e2.getInt32(102, true) / 1e7, minLat: e2.getInt32(106, true) / 1e7, maxLon: e2.getInt32(110, true) / 1e7, maxLat: e2.getInt32(114, true) / 1e7, centerZoom: e2.getUint8(118), centerLon: e2.getInt32(119, true) / 1e7, centerLat: e2.getInt32(123, true) / 1e7, etag: t2 };
}
function Z3(o3) {
  let t2 = { buf: new Uint8Array(o3), pos: 0 }, e2 = x4(t2), r2 = [], n2 = 0;
  for (let s3 = 0; s3 < e2; s3++) {
    let i3 = x4(t2);
    r2.push({ tileId: n2 + i3, offset: 0, length: 0, runLength: 1 }), n2 += i3;
  }
  for (let s3 = 0; s3 < e2; s3++) r2[s3].runLength = x4(t2);
  for (let s3 = 0; s3 < e2; s3++) r2[s3].length = x4(t2);
  for (let s3 = 0; s3 < e2; s3++) {
    let i3 = x4(t2);
    i3 === 0 && s3 > 0 ? r2[s3].offset = r2[s3 - 1].offset + r2[s3 - 1].length : r2[s3].offset = i3 - 1;
  }
  return r2;
}
function V3(o3, t2) {
  return h3(this, null, function* () {
    let e2 = yield o3.getBytes(0, 16384);
    if (new DataView(e2.data).getUint16(0, true) !== 19792) throw new Error("Wrong magic number for PMTiles archive");
    let n2 = e2.data.slice(0, Y3), s3 = X3(n2, e2.etag), i3 = e2.data.slice(s3.rootDirectoryOffset, s3.rootDirectoryOffset + s3.rootDirectoryLength), a3 = `${o3.getKey()}|${s3.etag || ""}|${s3.rootDirectoryOffset}|${s3.rootDirectoryLength}`, c3 = Z3(yield t2(i3, s3.internalCompression));
    return [s3, [a3, c3.length, c3]];
  });
}
function F3(o3, t2, e2, r2, n2, s3) {
  return h3(this, null, function* () {
    let i3 = yield o3.getBytes(e2, r2, s3, n2.etag), a3 = yield t2(i3.data, n2.internalCompression), c3 = Z3(a3);
    if (c3.length === 0) throw new Error("Empty directory is invalid");
    return c3;
  });
}
var j3, S3, d2, h3, re2, z3, A3, B3, J3, O3, Y3, T3, k3, D3, E3, R3, v4, U3, $3, M3, C3, H3, w3;
var init_esm = __esm({
  "node_modules/pmtiles/dist/esm/index.js"() {
    init_browser();
    j3 = Object.defineProperty;
    S3 = Math.pow;
    d2 = (o3, t2) => j3(o3, "name", { value: t2, configurable: true });
    h3 = (o3, t2, e2) => new Promise((r2, n2) => {
      var s3 = (c3) => {
        try {
          a3(e2.next(c3));
        } catch (l3) {
          n2(l3);
        }
      }, i3 = (c3) => {
        try {
          a3(e2.throw(c3));
        } catch (l3) {
          n2(l3);
        }
      }, a3 = (c3) => c3.done ? r2(c3.value) : Promise.resolve(c3.value).then(s3, i3);
      a3((e2 = e2.apply(o3, t2)).next());
    });
    re2 = d2((o3, t2) => {
      let e2 = false, r2 = "", n2 = L.GridLayer.extend({ createTile: d2((s3, i3) => {
        let a3 = document.createElement("img"), c3 = new AbortController(), l3 = c3.signal;
        return a3.cancel = () => {
          c3.abort();
        }, e2 || (o3.getHeader().then((u4) => {
          u4.tileType === 1 || u4.tileType === 6 ? console.error("Error: archive contains vector tiles, but leafletRasterLayer is for displaying raster tiles. See https://github.com/protomaps/PMTiles/tree/main/js for details.") : u4.tileType === 2 ? r2 = "image/png" : u4.tileType === 3 ? r2 = "image/jpeg" : u4.tileType === 4 ? r2 = "image/webp" : u4.tileType === 5 && (r2 = "image/avif");
        }), e2 = true), o3.getZxy(s3.z, s3.x, s3.y, l3).then((u4) => {
          if (u4) {
            let m4 = new Blob([u4.data], { type: r2 }), g5 = window.URL.createObjectURL(m4);
            a3.src = g5;
          } else a3.style.display = "none";
          a3.cancel = void 0, i3(void 0, a3);
        }).catch((u4) => {
          if (u4.name !== "AbortError") throw u4;
        }), a3;
      }, "createTile"), _removeTile: d2(function(s3) {
        let i3 = this._tiles[s3];
        i3 && (i3.el.cancel && i3.el.cancel(), i3.el.src && window.URL.revokeObjectURL(i3.el.src), i3.el.width = 0, i3.el.height = 0, i3.el.deleted = true, L.DomUtil.remove(i3.el), delete this._tiles[s3], this.fire("tileunload", { tile: i3.el, coords: this._keyToTileCoords(s3) }));
      }, "_removeTile") });
      return new n2(t2);
    }, "leafletRasterLayer");
    z3 = d2((o3) => (t2, e2) => {
      if (e2 instanceof AbortController) return o3(t2, e2);
      let r2 = new AbortController();
      return o3(t2, r2).then((n2) => e2(void 0, n2.data, n2.cacheControl || "", n2.expires || ""), (n2) => e2(n2)).catch((n2) => e2(n2)), { cancel: d2(() => r2.abort(), "cancel") };
    }, "v3compat");
    A3 = class A4 {
      constructor(t2) {
        this.tilev4 = d2((t3, e2) => h3(this, null, function* () {
          if (t3.type === "json") {
            let g5 = t3.url.substr(10), p4 = this.tiles.get(g5);
            if (p4 || (p4 = new w3(g5), this.tiles.set(g5, p4)), this.metadata) {
              let K4 = yield p4.getTileJson(t3.url);
              return e2.signal.throwIfAborted(), { data: K4 };
            }
            let f4 = yield p4.getHeader();
            return e2.signal.throwIfAborted(), (f4.minLon >= f4.maxLon || f4.minLat >= f4.maxLat) && console.error(`Bounds of PMTiles archive ${f4.minLon},${f4.minLat},${f4.maxLon},${f4.maxLat} are not valid.`), { data: { tiles: [`${t3.url}/{z}/{x}/{y}`], minzoom: f4.minZoom, maxzoom: f4.maxZoom, bounds: [f4.minLon, f4.minLat, f4.maxLon, f4.maxLat] } };
          }
          let r2 = new RegExp(/pmtiles:\/\/(.+)\/(\d+)\/(\d+)\/(\d+)/), n2 = t3.url.match(r2);
          if (!n2) throw new Error("Invalid PMTiles protocol URL");
          let s3 = n2[1], i3 = this.tiles.get(s3);
          i3 || (i3 = new w3(s3), this.tiles.set(s3, i3));
          let a3 = n2[2], c3 = n2[3], l3 = n2[4], u4 = yield i3 == null ? void 0 : i3.getZxy(+a3, +c3, +l3, e2.signal);
          if (e2.signal.throwIfAborted(), u4) return { data: new Uint8Array(u4.data), cacheControl: u4.cacheControl, expires: u4.expires };
          let m4 = yield i3.getHeader();
          if (m4.tileType === 1 || m4.tileType === 6) {
            if (this.errorOnMissingTile) throw new Error("Tile not found.");
            return { data: new Uint8Array() };
          }
          return { data: null };
        }), "tilev4");
        this.tile = z3(this.tilev4);
        this.tiles = /* @__PURE__ */ new Map(), this.metadata = (t2 == null ? void 0 : t2.metadata) || false, this.errorOnMissingTile = (t2 == null ? void 0 : t2.errorOnMissingTile) || false;
      }
      add(t2) {
        this.tiles.set(t2.source.getKey(), t2);
      }
      get(t2) {
        return this.tiles.get(t2);
      }
    };
    d2(A3, "Protocol");
    B3 = A3;
    d2(b4, "toNum");
    d2(N3, "readVarintRemainder");
    d2(x4, "readVarint");
    d2(I3, "rotate");
    d2(q3, "zxyToTileId");
    d2(G3, "tileIdToZ");
    d2(ie3, "tileIdToZxy");
    J3 = ((s3) => (s3[s3.Unknown = 0] = "Unknown", s3[s3.None = 1] = "None", s3[s3.Gzip = 2] = "Gzip", s3[s3.Brotli = 3] = "Brotli", s3[s3.Zstd = 4] = "Zstd", s3))(J3 || {});
    d2(P3, "defaultDecompress");
    O3 = ((a3) => (a3[a3.Unknown = 0] = "Unknown", a3[a3.Mvt = 1] = "Mvt", a3[a3.Png = 2] = "Png", a3[a3.Jpeg = 3] = "Jpeg", a3[a3.Webp = 4] = "Webp", a3[a3.Avif = 5] = "Avif", a3[a3.Mlt = 6] = "Mlt", a3))(O3 || {});
    d2(_4, "tileTypeExt");
    Y3 = 127;
    d2(Q3, "findTile");
    T3 = class T4 {
      constructor(t2) {
        this.file = t2;
      }
      getKey() {
        return this.file.name;
      }
      getBytes(t2, e2) {
        return h3(this, null, function* () {
          return { data: yield this.file.slice(t2, t2 + e2).arrayBuffer() };
        });
      }
    };
    d2(T3, "FileSource");
    k3 = T3;
    D3 = class D4 {
      constructor(t2, e2 = new Headers(), r2 = void 0) {
        var a3, c3;
        this.url = t2, this.customHeaders = e2, this.credentials = r2, this.mustReload = false;
        let n2 = "";
        "navigator" in globalThis && (n2 = (c3 = (a3 = globalThis.navigator) == null ? void 0 : a3.userAgent) != null ? c3 : "");
        let s3 = n2.indexOf("Windows") > -1, i3 = /Chrome|Chromium|Edg|OPR|Brave/.test(n2);
        this.chromeWindowsNoCache = false, s3 && i3 && (this.chromeWindowsNoCache = true);
      }
      getKey() {
        return this.url;
      }
      setHeaders(t2) {
        this.customHeaders = t2;
      }
      getBytes(t2, e2, r2, n2) {
        return h3(this, null, function* () {
          let s3, i3;
          r2 ? i3 = r2 : (s3 = new AbortController(), i3 = s3.signal);
          let a3 = new Headers(this.customHeaders);
          a3.set("range", `bytes=${t2}-${t2 + e2 - 1}`);
          let c3;
          this.mustReload ? c3 = "reload" : this.chromeWindowsNoCache && (c3 = "no-store");
          let l3 = yield fetch(this.url, { signal: i3, cache: c3, headers: a3, credentials: this.credentials });
          if (t2 === 0 && l3.status === 416) {
            let p4 = l3.headers.get("Content-Range");
            if (!p4 || !p4.startsWith("bytes */")) throw new Error("Missing content-length on 416 response");
            let f4 = +p4.substr(8);
            a3.set("range", `bytes=0-${f4 - 1}`), l3 = yield fetch(this.url, { signal: i3, cache: "reload", headers: a3, credentials: this.credentials });
          }
          let u4 = l3.headers.get("Etag");
          if (u4 != null && u4.startsWith("W/") && (u4 = null), l3.status === 416 || n2 && u4 && u4 !== n2) throw this.mustReload = true, new v4(`Server returned non-matching ETag ${n2} after one retry. Check browser extensions and servers for issues that may affect correct ETag headers.`);
          if (l3.status >= 300) throw new Error(`Bad response code: ${l3.status}`);
          let m4 = l3.headers.get("Content-Length");
          if (l3.status === 200 && (!m4 || +m4 > e2)) throw s3 && s3.abort(), new Error("Server returned no content-length header or content-length exceeding request. Check that your storage backend supports HTTP Byte Serving.");
          return { data: yield l3.arrayBuffer(), etag: u4 || void 0, cacheControl: l3.headers.get("Cache-Control") || void 0, expires: l3.headers.get("Expires") || void 0 };
        });
      }
    };
    d2(D3, "FetchSource");
    E3 = D3;
    d2(y4, "getUint64");
    d2(X3, "bytesToHeader");
    d2(Z3, "deserializeIndex");
    R3 = class R4 extends Error {
    };
    d2(R3, "EtagMismatch");
    v4 = R3;
    d2(V3, "getHeaderAndRoot");
    d2(F3, "getDirectory");
    U3 = class U4 {
      constructor(t2 = 100, e2 = true, r2 = P3) {
        this.cache = /* @__PURE__ */ new Map(), this.maxCacheEntries = t2, this.counter = 1, this.decompress = r2;
      }
      getHeader(t2) {
        return h3(this, null, function* () {
          let e2 = t2.getKey(), r2 = this.cache.get(e2);
          if (r2) return r2.lastUsed = this.counter++, r2.data;
          let n2 = yield V3(t2, this.decompress);
          return n2[1] && this.cache.set(n2[1][0], { lastUsed: this.counter++, data: n2[1][2] }), this.cache.set(e2, { lastUsed: this.counter++, data: n2[0] }), this.prune(), n2[0];
        });
      }
      getDirectory(t2, e2, r2, n2, s3) {
        return h3(this, null, function* () {
          let i3 = `${t2.getKey()}|${n2.etag || ""}|${e2}|${r2}`, a3 = this.cache.get(i3);
          if (a3) return a3.lastUsed = this.counter++, a3.data;
          let c3 = yield F3(t2, this.decompress, e2, r2, n2, s3);
          return this.cache.set(i3, { lastUsed: this.counter++, data: c3 }), this.prune(), c3;
        });
      }
      prune() {
        if (this.cache.size > this.maxCacheEntries) {
          let t2 = 1 / 0, e2;
          this.cache.forEach((r2, n2) => {
            r2.lastUsed < t2 && (t2 = r2.lastUsed, e2 = n2);
          }), e2 && this.cache.delete(e2);
        }
      }
      invalidate(t2) {
        return h3(this, null, function* () {
          this.cache.delete(t2.getKey());
        });
      }
    };
    d2(U3, "ResolvedValueCache");
    $3 = U3;
    M3 = class M4 {
      constructor(t2 = 100, e2 = true, r2 = P3) {
        this.cache = /* @__PURE__ */ new Map(), this.invalidations = /* @__PURE__ */ new Map(), this.pendingFetches = /* @__PURE__ */ new Map(), this.maxCacheEntries = t2, this.counter = 1, this.decompress = r2;
      }
      getHeader(t2) {
        return h3(this, null, function* () {
          let e2 = t2.getKey(), r2 = this.cache.get(e2);
          if (r2) return r2.lastUsed = this.counter++, yield r2.data;
          let n2 = new Promise((s3, i3) => {
            V3(t2, this.decompress).then((a3) => {
              a3[1] && this.cache.set(a3[1][0], { lastUsed: this.counter++, data: Promise.resolve(a3[1][2]) }), s3(a3[0]), this.prune();
            }).catch((a3) => {
              i3(a3);
            });
          });
          return this.cache.set(e2, { lastUsed: this.counter++, data: n2 }), n2;
        });
      }
      trackSignal(t2, e2, r2) {
        e2.refs++, r2.addEventListener("abort", () => {
          --e2.refs <= 0 && this.pendingFetches.get(t2) === e2 && (e2.controller.abort(), this.cache.delete(t2), this.pendingFetches.delete(t2));
        }, { once: true });
      }
      getDirectory(t2, e2, r2, n2, s3) {
        return h3(this, null, function* () {
          let i3 = `${t2.getKey()}|${n2.etag || ""}|${e2}|${r2}`, a3 = this.cache.get(i3);
          if (a3) {
            a3.lastUsed = this.counter++;
            let m4 = this.pendingFetches.get(i3);
            return m4 && this.trackSignal(i3, m4, s3 != null ? s3 : new AbortController().signal), yield a3.data;
          }
          let c3 = new AbortController(), l3 = { controller: c3, refs: 0 };
          this.trackSignal(i3, l3, s3 != null ? s3 : new AbortController().signal), this.pendingFetches.set(i3, l3);
          let u4 = new Promise((m4, g5) => {
            F3(t2, this.decompress, e2, r2, n2, c3.signal).then((p4) => {
              this.pendingFetches.delete(i3), m4(p4), this.prune();
            }).catch((p4) => {
              g5(p4);
            });
          });
          return this.cache.set(i3, { lastUsed: this.counter++, data: u4 }), u4;
        });
      }
      prune() {
        if (this.cache.size >= this.maxCacheEntries) {
          let t2 = 1 / 0, e2;
          this.cache.forEach((r2, n2) => {
            r2.lastUsed < t2 && (t2 = r2.lastUsed, e2 = n2);
          }), e2 && this.cache.delete(e2);
        }
      }
      invalidate(t2) {
        return h3(this, null, function* () {
          let e2 = t2.getKey();
          if (this.invalidations.get(e2)) return yield this.invalidations.get(e2);
          this.cache.delete(t2.getKey());
          let r2 = new Promise((n2, s3) => {
            this.getHeader(t2).then((i3) => {
              n2(), this.invalidations.delete(e2);
            }).catch((i3) => {
              s3(i3);
            });
          });
          this.invalidations.set(e2, r2);
        });
      }
    };
    d2(M3, "SharedPromiseCache");
    C3 = M3;
    H3 = class H4 {
      constructor(t2, e2, r2) {
        typeof t2 == "string" ? this.source = new E3(t2) : this.source = t2, r2 ? this.decompress = r2 : this.decompress = P3, e2 ? this.cache = e2 : this.cache = new C3();
      }
      getHeader() {
        return h3(this, null, function* () {
          return yield this.cache.getHeader(this.source);
        });
      }
      getZxyAttempt(t2, e2, r2, n2) {
        return h3(this, null, function* () {
          let s3 = q3(t2, e2, r2), i3 = yield this.cache.getHeader(this.source);
          if (n2 == null || n2.throwIfAborted(), t2 < i3.minZoom || t2 > i3.maxZoom) return;
          let a3 = i3.rootDirectoryOffset, c3 = i3.rootDirectoryLength;
          for (let l3 = 0; l3 <= 3; l3++) {
            let u4 = yield this.cache.getDirectory(this.source, a3, c3, i3, n2);
            n2 == null || n2.throwIfAborted();
            let m4 = Q3(u4, s3);
            if (m4) {
              if (m4.runLength > 0) {
                let g5 = yield this.source.getBytes(i3.tileDataOffset + m4.offset, m4.length, n2, i3.etag);
                return { data: yield this.decompress(g5.data, i3.tileCompression), cacheControl: g5.cacheControl, expires: g5.expires };
              }
              a3 = i3.leafDirectoryOffset + m4.offset, c3 = m4.length;
            } else return;
          }
          throw new Error("Maximum directory depth exceeded");
        });
      }
      getZxy(t2, e2, r2, n2) {
        return h3(this, null, function* () {
          try {
            return yield this.getZxyAttempt(t2, e2, r2, n2);
          } catch (s3) {
            if (s3 instanceof v4) return this.cache.invalidate(this.source), yield this.getZxyAttempt(t2, e2, r2, n2);
            throw s3;
          }
        });
      }
      getMetadataAttempt() {
        return h3(this, null, function* () {
          let t2 = yield this.cache.getHeader(this.source), e2 = yield this.source.getBytes(t2.jsonMetadataOffset, t2.jsonMetadataLength, void 0, t2.etag), r2 = yield this.decompress(e2.data, t2.internalCompression), n2 = new TextDecoder("utf-8");
          return JSON.parse(n2.decode(r2));
        });
      }
      getMetadata() {
        return h3(this, null, function* () {
          try {
            return yield this.getMetadataAttempt();
          } catch (t2) {
            if (t2 instanceof v4) return this.cache.invalidate(this.source), yield this.getMetadataAttempt();
            throw t2;
          }
        });
      }
      getTileJson(t2) {
        return h3(this, null, function* () {
          let e2 = yield this.getHeader(), r2 = yield this.getMetadata(), n2 = _4(e2.tileType);
          return { tilejson: "3.0.0", scheme: "xyz", tiles: [`${t2}/{z}/{x}/{y}${n2}`], vector_layers: r2.vector_layers, attribution: r2.attribution, description: r2.description, name: r2.name, version: r2.version, bounds: [e2.minLon, e2.minLat, e2.maxLon, e2.maxLat], center: [e2.centerLon, e2.centerLat, e2.centerZoom], minzoom: e2.minZoom, maxzoom: e2.maxZoom };
        });
      }
    };
    d2(H3, "PMTiles");
    w3 = H3;
  }
});

// node_modules/3d-tiles-renderer/build/renderer-_7gAivIK.js
var e = Object.defineProperty;
var t = (t2, n2) => {
  let r2 = {};
  for (var i3 in t2) e(r2, i3, {
    get: t2[i3],
    enumerable: true
  });
  return n2 || e(r2, Symbol.toStringTag, { value: "Module" }), r2;
};
function n(e2) {
  try {
    let t2 = typeof location < "u" ? location.href : void 0;
    return new URL(e2, t2).origin;
  } catch {
    return null;
  }
}
function r(e2) {
  if (!e2) return null;
  let t2 = e2.length, n2 = e2.indexOf("?"), r2 = e2.indexOf("#");
  n2 !== -1 && (t2 = Math.min(t2, n2)), r2 !== -1 && (t2 = Math.min(t2, r2));
  let i3 = e2.lastIndexOf(".", t2), a3 = e2.lastIndexOf("/", t2), o3 = e2.indexOf("://");
  return o3 !== -1 && o3 + 2 === a3 || i3 === -1 || i3 < a3 ? null : e2.substring(i3 + 1, t2) || null;
}
var _a;
var i = (_a = class {
  static setXRSession(e2) {
    e2 !== this.session && (this.flushPending(), this.session = e2);
  }
  static requestAnimationFrame(e2) {
    let { session: t2, pending: n2 } = this, r2, i3 = () => {
      n2.delete(r2), e2();
    };
    return r2 = t2 ? t2.requestAnimationFrame(i3) : requestAnimationFrame(i3), n2.set(r2, e2), r2;
  }
  static cancelAnimationFrame(e2) {
    let { pending: t2, session: n2 } = this;
    t2.delete(e2), n2 ? n2.cancelAnimationFrame(e2) : cancelAnimationFrame(e2);
  }
  static flushPending() {
    this.pending.forEach((e2, t2) => {
      e2(), this.cancelAnimationFrame(t2);
    });
  }
}, __publicField(_a, "pending", /* @__PURE__ */ new Map()), __publicField(_a, "session", null), _a);
var a = 2 ** 30;
var o = class {
  get unloadPriorityCallback() {
    return this._unloadPriorityCallback;
  }
  set unloadPriorityCallback(e2) {
    e2.length === 1 ? (console.warn('LRUCache: "unloadPriorityCallback" function has been changed to take two arguments.'), this._unloadPriorityCallback = (t2, n2) => {
      let r2 = e2(t2), i3 = e2(n2);
      return r2 < i3 ? -1 : +(r2 > i3);
    }) : this._unloadPriorityCallback = e2;
  }
  constructor() {
    this.minSize = 6e3, this.maxSize = 8e3, this.minBytesSize = 0.3 * a, this.maxBytesSize = 0.4 * a, this.unloadPercent = 0.05, this.autoMarkUnused = true, this.cachedBytes = 0, this.itemSet = /* @__PURE__ */ new Map(), this.itemList = [], this.usedSet = /* @__PURE__ */ new Set(), this.callbacks = /* @__PURE__ */ new Map(), this.unloadingHandle = -1, this.bytesMap = /* @__PURE__ */ new Map(), this.loadedSet = /* @__PURE__ */ new Set(), this._unloadPriorityCallback = null;
    let e2 = this.itemSet;
    this.defaultPriorityCallback = (t2) => e2.get(t2);
  }
  isFull() {
    return this.itemSet.size >= this.maxSize || this.cachedBytes >= this.maxBytesSize;
  }
  getMemoryUsage(e2) {
    return this.bytesMap.get(e2) || 0;
  }
  setMemoryUsage(e2, t2) {
    let { bytesMap: n2, itemSet: r2 } = this;
    r2.has(e2) && (t2 = Math.round(t2), this.cachedBytes -= n2.get(e2) || 0, n2.set(e2, t2), this.cachedBytes += t2);
  }
  add(e2, t2) {
    let n2 = this.itemSet;
    if (n2.has(e2) || this.isFull()) return false;
    let r2 = this.usedSet, i3 = this.itemList, a3 = this.callbacks;
    return i3.push(e2), r2.add(e2), n2.set(e2, Date.now()), a3.set(e2, t2), true;
  }
  has(e2) {
    return this.itemSet.has(e2);
  }
  remove(e2) {
    let t2 = this.usedSet, n2 = this.itemSet, r2 = this.itemList, i3 = this.bytesMap, a3 = this.callbacks, o3 = this.loadedSet;
    if (n2.has(e2)) {
      this.cachedBytes -= i3.get(e2) || 0, i3.delete(e2), a3.get(e2)(e2);
      let s3 = r2.indexOf(e2);
      return r2.splice(s3, 1), t2.delete(e2), n2.delete(e2), a3.delete(e2), o3.delete(e2), true;
    }
    return false;
  }
  setLoaded(e2, t2) {
    let { itemSet: n2, loadedSet: r2 } = this;
    n2.has(e2) && (t2 === true ? r2.add(e2) : r2.delete(e2));
  }
  markUsed(e2) {
    let t2 = this.itemSet, n2 = this.usedSet;
    t2.has(e2) && !n2.has(e2) && (t2.set(e2, Date.now()), n2.add(e2));
  }
  markUnused(e2) {
    this.usedSet.delete(e2);
  }
  markAllUnused() {
    this.usedSet.clear();
  }
  isUsed(e2) {
    return this.usedSet.has(e2);
  }
  unloadUnusedContent() {
    let { unloadPercent: e2, minSize: t2, maxSize: n2, itemList: r2, itemSet: a3, usedSet: o3, loadedSet: s3, callbacks: c3, bytesMap: l3, minBytesSize: u4, maxBytesSize: d5 } = this, f4 = r2.length - o3.size, p4 = r2.length - s3.size, m4 = Math.max(Math.min(r2.length - t2, f4), 0), h5 = this.cachedBytes - u4, g5 = this.unloadPriorityCallback || this.defaultPriorityCallback, _6 = false, v6 = m4 > 0 && f4 > 0 || p4 && r2.length > n2;
    if (f4 && this.cachedBytes > u4 || p4 && this.cachedBytes > d5 || v6) {
      r2.sort((e3, t3) => {
        let n3 = o3.has(e3);
        if (n3 === o3.has(t3)) {
          let n4 = s3.has(e3);
          return n4 === s3.has(t3) ? -g5(e3, t3) : n4 ? 1 : -1;
        } else return n3 ? 1 : -1;
      });
      let i3 = Math.max(t2 * e2, m4 * e2), p5 = Math.ceil(Math.min(i3, f4, m4)), v7 = Math.max(e2 * h5, e2 * u4), y6 = Math.min(v7, h5), b6 = 0, x6 = 0;
      for (; b6 < r2.length && (this.cachedBytes - x6 > d5 || r2.length - b6 > n2); ) {
        let e3 = r2[b6], t3 = l3.get(e3) || 0;
        if (o3.has(e3) && s3.has(e3) || this.cachedBytes - x6 - t3 < d5 && r2.length - b6 <= n2) break;
        x6 += t3, b6++;
      }
      for (; b6 < r2.length && (x6 < y6 || b6 < p5); ) {
        let e3 = r2[b6], t3 = l3.get(e3) || 0;
        if (o3.has(e3) || this.cachedBytes - x6 - t3 < u4 && b6 >= p5) break;
        x6 += t3, b6++;
      }
      r2.splice(0, b6).forEach((e3) => {
        this.cachedBytes -= l3.get(e3) || 0, c3.get(e3)(e3), l3.delete(e3), a3.delete(e3), c3.delete(e3), s3.delete(e3), o3.delete(e3);
      }), _6 = b6 < m4 || x6 < h5 && b6 < f4, _6 && (_6 = b6 > 0);
    }
    _6 && (this.unloadingHandle = i.requestAnimationFrame(() => this.scheduleUnload()));
  }
  scheduleUnload() {
    i.cancelAnimationFrame(this.unloadingHandle), this.scheduled || (this.scheduled = true, queueMicrotask(() => {
      this.scheduled = false, this.unloadUnusedContent();
    }));
  }
};
var s = class extends DOMException {
  constructor() {
    super("PriorityQueue: Item removed", "AbortError");
  }
};
var c = class {
  get running() {
    return this.items.length !== 0 || this.currJobs !== 0;
  }
  constructor() {
    this.maxJobs = 6, this.items = [], this.callbacks = /* @__PURE__ */ new Map(), this.currJobs = 0, this.scheduled = false, this.autoUpdate = true, this.priorityCallback = null, this._schedulingCallback = (e2) => {
      i.requestAnimationFrame(e2);
    }, this._runjobs = () => {
      this.scheduled = false, this.tryRunJobs();
    };
  }
  sort() {
    let e2 = this.priorityCallback, t2 = this.items;
    e2 !== null && t2.sort(e2);
  }
  has(e2) {
    return this.callbacks.has(e2);
  }
  add(e2, t2) {
    let n2 = {
      callback: t2,
      reject: null,
      resolve: null,
      promise: null
    };
    return n2.promise = new Promise((t3, r2) => {
      let i3 = this.items, a3 = this.callbacks;
      n2.resolve = t3, n2.reject = r2, i3.unshift(e2), a3.set(e2, n2), this.autoUpdate && this.scheduleJobRun();
    }), n2.promise;
  }
  remove(e2) {
    let t2 = this.items, n2 = this.callbacks, r2 = t2.indexOf(e2);
    if (r2 !== -1) {
      let i3 = n2.get(e2);
      i3.promise.catch((e3) => {
        if (e3.name !== "AbortError") throw e3;
      }), i3.reject(new s()), t2.splice(r2, 1), n2.delete(e2);
    }
  }
  removeByFilter(e2) {
    let { items: t2 } = this;
    for (let n2 = 0; n2 < t2.length; n2++) {
      let r2 = t2[n2];
      e2(r2) && (this.remove(r2), n2--);
    }
  }
  tryRunJobs() {
    this.sort();
    let e2 = this.items, t2 = this.callbacks, n2 = this.maxJobs, r2 = 0, i3 = () => {
      this.currJobs--, this.autoUpdate && this.scheduleJobRun();
    };
    for (; n2 > this.currJobs && e2.length > 0 && r2 < n2; ) {
      this.currJobs++, r2++;
      let n3 = e2.pop(), { callback: a3, resolve: o3, reject: s3 } = t2.get(n3);
      t2.delete(n3);
      let c3;
      try {
        c3 = a3(n3);
      } catch (e3) {
        s3(e3), i3();
        continue;
      }
      c3 instanceof Promise ? c3.then(o3).catch(s3).finally(i3) : (o3(c3), i3());
    }
  }
  flush(e2) {
    let { items: t2, callbacks: n2 } = this, r2 = t2.indexOf(e2);
    if (!n2.has(e2)) return;
    let { callback: i3, resolve: a3, reject: o3 } = n2.get(e2);
    n2.delete(e2), t2.splice(r2, 1);
    let s3;
    try {
      s3 = i3(e2);
    } catch (e3) {
      o3(e3);
      return;
    }
    return s3 instanceof Promise ? s3.then(a3).catch(o3) : a3(s3), s3;
  }
  scheduleJobRun() {
    this.scheduled || (this.scheduled = (this._schedulingCallback(this._runjobs), true));
  }
};
var l = class {
  get running() {
    for (let e2 of this.originQueues.values()) if (e2.running) return true;
    return false;
  }
  get maxJobsPerOrigin() {
    return this._maxJobsPerOrigin;
  }
  set maxJobsPerOrigin(e2) {
    this._maxJobsPerOrigin = e2, this.originQueues.forEach((t2) => t2.maxJobs = e2);
  }
  get maxJobs() {
    return this.maxJobsPerOrigin;
  }
  set maxJobs(e2) {
    console.warn('DownloadPriorityQueue: "maxJobs" is no longer valid and limits jobs per server origin. Use "maxJobsPerOrigin", instead.'), this.maxJobsPerOrigin = e2;
  }
  get priorityCallback() {
    return this._priorityCallback;
  }
  set priorityCallback(e2) {
    this._priorityCallback = e2, this.originQueues.forEach((t2) => t2.priorityCallback = e2);
  }
  constructor() {
    this.originQueues = /* @__PURE__ */ new Map(), this._itemQueues = /* @__PURE__ */ new WeakMap(), this._maxJobsPerOrigin = 6, this._priorityCallback = null;
  }
  add(e2, t2, r2, i3 = null) {
    this.originQueues.forEach((e3, t3) => {
      e3.running || this.originQueues.delete(t3);
    });
    let a3 = e2 === null ? null : n(e2), o3 = this.originQueues.get(a3);
    o3 || (o3 = new c(), o3.maxJobs = this._maxJobsPerOrigin, o3.priorityCallback = this._priorityCallback, this.originQueues.set(a3, o3));
    let s3 = this._itemQueues.get(t2);
    if (s3 && s3 !== o3 && s3.has(t2)) throw Error("DownloadPriorityQueue: Item is already queued with a different url origin.");
    this._itemQueues.set(t2, o3);
    let l3 = o3.add(t2, r2);
    return i3 !== null && (i3.aborted ? this.remove(t2) : i3.addEventListener("abort", () => this.remove(t2), { once: true })), l3;
  }
  remove(e2) {
    let t2 = this._itemQueues.get(e2);
    t2 && (t2.remove(e2), this._itemQueues.delete(e2));
  }
  has(e2) {
    let t2 = this._itemQueues.get(e2);
    return !!(t2 && t2.has(e2));
  }
};
var g = 6378137;
var _ = 1 / 298.257223563;
var v = 6356752314245179e-9;
var y = {
  inView: false,
  error: Infinity,
  distanceFromCamera: Infinity
};
function b(e2) {
  return e2 === 4 || e2 === -1;
}
function x(e2, t2) {
  return S(e2) && e2.traversal.lastFrameVisited === t2 && e2.traversal.used;
}
function S(e2) {
  return !!e2.traversal;
}
function C(e2) {
  let { children: t2 } = e2, n2 = t2.length === 0 || S(t2[t2.length - 1]), r2 = !e2.internal.hasUnrenderableContent || b(e2.internal.loadingState);
  return n2 && r2;
}
function w(e2) {
  return e2.traversal.unconditionallyRefine;
}
function T(e2, t2, n2 = true) {
  if (S(e2) && (t2.ensureChildrenArePreprocessed(e2), e2.traversal.lastFrameVisited !== t2.frameCount && (e2.traversal.wasInFrustum = e2.traversal.inFrustum, e2.traversal.wasSetActive = e2.traversal.active, e2.traversal.wasSetVisible = e2.traversal.visible, e2.traversal.usedLastFrame = e2.traversal.used, e2.traversal.lastFrameVisited = t2.frameCount, e2.traversal.used = false, e2.traversal.inFrustum = false, e2.traversal.isLeaf = false, e2.traversal.visible = false, e2.traversal.active = false, e2.traversal.error = Infinity, e2.traversal.distanceFromCamera = Infinity, e2.traversal.allChildrenReady = false, e2.traversal.allChildrenLoaded = false, e2.traversal.kicked = false, e2.traversal.allUsedChildrenProcessed = false, n2 && (t2.calculateTileViewErrorWithPlugin(e2, y), e2.traversal.inFrustum = y.inView, e2.traversal.error = y.error, e2.traversal.distanceFromCamera = y.distanceFromCamera), e2.traversal.unconditionallyRefine = e2.internal.hasUnrenderableContent, !e2.traversal.unconditionallyRefine))) {
    let t3 = e2.parent;
    for (; t3 && t3.traversal.unconditionallyRefine; ) t3 = t3.parent;
    t3 && t3.geometricError <= e2.geometricError && (e2.traversal.unconditionallyRefine = true);
  }
}
function E(e2, t2, n2 = false) {
  if (T(e2, t2), n2 ? t2.markTileUsed(e2) : O(e2), w(e2) && C(e2)) {
    let r2 = e2.children;
    for (let e3 = 0, i3 = r2.length; e3 < i3; e3++) E(r2[e3], t2, n2);
  }
}
function D(e2, t2) {
  if (T(e2, t2), e2.traversal.usedLastFrame && (O(e2), e2.traversal.wasSetActive && (e2.traversal.active = true), (!e2.traversal.active || w(e2)) && C(e2))) {
    let n2 = e2.children;
    for (let e3 = 0, r2 = n2.length; e3 < r2; e3++) D(n2[e3], t2);
  }
}
function O(e2) {
  e2.traversal.used = true;
}
function ee(e2, t2) {
  return !(e2.traversal.error <= t2.errorTarget && !w(e2) || t2.maxDepth > 0 && e2.internal.depth + 1 >= t2.maxDepth || !C(e2));
}
function k(e2, t2) {
  let { frameCount: n2 } = t2, { children: r2 } = e2;
  for (let e3 = 0, i3 = r2.length; e3 < i3; e3++) {
    let i4 = r2[e3];
    x(i4, n2) && (i4.traversal.active && (i4.traversal.kicked = true, i4.traversal.active = false), k(i4, t2));
  }
}
function A(e2) {
  return !w(e2) && (!e2.internal.hasContent || b(e2.internal.loadingState));
}
function j(e2, t2) {
  if (T(e2, t2), !e2.traversal.inFrustum) return;
  let n2 = e2.parent;
  if (n2 && n2.refine === "ADD" && e2.geometricError > 0 && e2.traversal.error * (n2.geometricError / e2.geometricError) <= t2.errorTarget) return;
  if (!ee(e2, t2)) {
    O(e2);
    return;
  }
  let r2 = false, i3 = false, a3 = e2.children;
  for (let e3 = 0, n3 = a3.length; e3 < n3; e3++) {
    let n4 = a3[e3];
    j(n4, t2), r2 || (r2 = x(n4, t2.frameCount)), i3 || (i3 = n4.traversal.inFrustum);
  }
  if (e2.refine === "REPLACE" && !i3 && a3.length !== 0) {
    e2.traversal.inFrustum = false, t2.markTileUsed(e2);
    for (let e3 = 0, n3 = a3.length; e3 < n3; e3++) E(a3[e3], t2, true);
    return;
  }
  if (O(e2), e2.refine === "REPLACE" && r2 && (t2.loadSiblings || t2.loadAncestors)) for (let e3 = 0, n3 = a3.length; e3 < n3; e3++) E(a3[e3], t2);
}
function M(e2, t2) {
  let n2 = t2.frameCount;
  if (!x(e2, n2)) return;
  let r2 = e2.children, i3 = false;
  for (let e3 = 0, t3 = r2.length; e3 < t3; e3++) {
    let t4 = r2[e3];
    i3 || (i3 = x(t4, n2));
  }
  if (!i3) e2.traversal.isLeaf = true;
  else {
    for (let e3 = 0, n3 = r2.length; e3 < n3; e3++) M(r2[e3], t2);
    let i4 = true;
    for (let e3 = 0, t3 = r2.length; e3 < t3; e3++) {
      let t4 = r2[e3];
      if (x(t4, n2)) {
        let e4 = !w(t4), n3 = !t4.internal.hasContent || b(t4.internal.loadingState);
        e4 && n3 || t4.traversal.allChildrenLoaded || (i4 = false);
      }
    }
    e2.traversal.allChildrenLoaded = i4;
  }
  let a3 = true;
  for (let e3 = 0, n3 = r2.length; e3 < n3; e3++) {
    let n4 = r2[e3];
    x(n4, t2.frameCount) && !n4.traversal.allUsedChildrenProcessed && (a3 = false);
  }
  e2.traversal.allUsedChildrenProcessed = a3 && C(e2);
}
function N(e2, t2) {
  if (!x(e2, t2.frameCount)) return;
  let n2 = e2.children;
  if (e2.refine === "REPLACE" && t2.loadAncestors && !e2.traversal.allChildrenLoaded && !w(e2) && (e2.traversal.isLeaf = true), e2.traversal.isLeaf) {
    if (!w(e2) && (e2.traversal.active = true, C(e2) && e2.internal.hasContent && !b(e2.internal.loadingState))) for (let e3 = 0, r3 = n2.length; e3 < r3; e3++) D(n2[e3], t2);
    return;
  }
  let r2 = n2.length > 0;
  for (let e3 = 0, i3 = n2.length; e3 < i3; e3++) {
    let i4 = n2[e3];
    N(i4, t2), x(i4, t2.frameCount) && !(i4.traversal.active && A(i4)) && !i4.traversal.allChildrenReady && (r2 = false);
  }
  e2.traversal.allChildrenReady = r2, e2.refine === "REPLACE" && !r2 && e2.traversal.wasSetActive && A(e2) && (e2.traversal.active = true, k(e2, t2));
}
function P(e2, t2) {
  T(e2, t2, false);
  let n2 = x(e2, t2.frameCount);
  if (n2 && (e2.internal.hasUnrenderableContent && (t2.markTileUsed(e2), t2.queueTileForDownload(e2)), e2.internal.hasRenderableContent && e2.refine === "ADD" && (e2.traversal.active = true), (e2.traversal.active || e2.traversal.kicked) && e2.internal.hasContent && (t2.markTileUsed(e2), e2.traversal.allUsedChildrenProcessed && t2.queueTileForDownload(e2), e2.internal.loadingState !== 4 && (e2.traversal.active = false)), t2.loadAncestors && e2.internal.hasContent && (t2.markTileUsed(e2), t2.queueTileForDownload(e2)), e2.internal.virtualChildCount > 0 && e2.internal.hasContent && t2.markTileUsed(e2), e2.traversal.visible = e2.internal.hasRenderableContent && e2.traversal.active && e2.traversal.inFrustum && e2.internal.loadingState === 4, t2.stats.used++, e2.traversal.inFrustum && t2.stats.inFrustum++), n2 || S(e2) && e2.traversal.usedLastFrame) {
    let r2 = false, i3 = false;
    n2 ? (r2 = e2.traversal.active, i3 = t2.displayActiveTiles && e2.traversal.active || e2.traversal.visible) : T(e2, t2, false), e2.internal.hasRenderableContent && e2.internal.loadingState === 4 ? (r2 && t2.stats.active++, i3 && t2.stats.visible++, e2.traversal.wasSetActive !== r2 && t2.invokeOnePlugin((t3) => t3.setTileActive && t3.setTileActive(e2, r2)), e2.traversal.wasSetVisible !== i3 && t2.invokeOnePlugin((t3) => t3.setTileVisible && t3.setTileVisible(e2, i3))) : e2.internal.hasRenderableContent || (i3 = e2.traversal.isLeaf, e2.traversal.wasSetVisible !== i3 && t2.invokeOnePlugin((t3) => t3.setEmptyTileVisible && t3.setEmptyTileVisible(e2, i3))), e2.traversal.visible = i3, e2.traversal.active = r2;
    let a3 = e2.children;
    for (let e3 = 0, n3 = a3.length; e3 < n3; e3++) {
      let n4 = a3[e3];
      P(n4, t2);
    }
  }
}
function te(e2, t2) {
  j(e2, t2), M(e2, t2), N(e2, t2), P(e2, t2);
}
function ne(e2) {
  let t2 = null;
  return () => {
    t2 === null && (t2 = i.requestAnimationFrame(() => {
      t2 = null, e2();
    }));
  };
}
function F(e2, t2 = null, n2 = null) {
  let r2 = [];
  for (r2.push(e2), r2.push(null), r2.push(0); r2.length > 0; ) {
    let e3 = r2.pop(), i3 = r2.pop(), a3 = r2.pop();
    if (t2 && t2(a3, i3, e3)) {
      n2 && n2(a3, i3, e3);
      return;
    }
    let o3 = a3.children;
    if (o3) for (let t3 = o3.length - 1; t3 >= 0; t3--) r2.push(o3[t3]), r2.push(a3), r2.push(e3 + 1);
    n2 && n2(a3, i3, e3);
  }
}
function I(e2, t2 = null) {
  let n2 = e2;
  for (; n2; ) {
    let e3 = n2.internal.depth, r2 = n2.parent;
    t2 && t2(n2, r2, e3), n2 = r2;
  }
}
var L2 = Symbol("PLUGIN_REGISTERED");
var R = {
  inView: true,
  error: 0,
  distance: Infinity
};
var z = (e2, t2) => {
  let n2 = e2.priority || 0, r2 = t2.priority || 0;
  return n2 === r2 ? !e2.traversal || !t2.traversal ? 0 : e2.traversal.used === t2.traversal.used ? e2.traversal.error === t2.traversal.error ? e2.traversal.distanceFromCamera === t2.traversal.distanceFromCamera ? e2.internal.depthFromRenderedParent === t2.internal.depthFromRenderedParent ? 0 : e2.internal.depthFromRenderedParent > t2.internal.depthFromRenderedParent ? -1 : 1 : e2.traversal.distanceFromCamera > t2.traversal.distanceFromCamera ? -1 : 1 : e2.traversal.error > t2.traversal.error ? 1 : -1 : e2.traversal.used ? 1 : -1 : n2 > r2 ? 1 : -1;
};
var B = (e2, t2) => e2.traversal.used === t2.traversal.used ? e2.traversal.inFrustum === t2.traversal.inFrustum ? e2.internal.hasUnrenderableContent === t2.internal.hasUnrenderableContent ? e2.traversal.distanceFromCamera === t2.traversal.distanceFromCamera ? e2.internal.depthFromRenderedParent === t2.internal.depthFromRenderedParent ? 0 : e2.internal.depthFromRenderedParent > t2.internal.depthFromRenderedParent ? -1 : 1 : e2.traversal.distanceFromCamera > t2.traversal.distanceFromCamera ? -1 : 1 : e2.internal.hasUnrenderableContent ? 1 : -1 : e2.traversal.inFrustum ? 1 : -1 : e2.traversal.used ? 1 : -1;
var V = (e2, t2) => e2.traversal.lastFrameVisited === t2.traversal.lastFrameVisited ? e2.internal.depthFromRenderedParent === t2.internal.depthFromRenderedParent ? e2.internal.loadingState === t2.internal.loadingState ? e2.internal.hasUnrenderableContent === t2.internal.hasUnrenderableContent ? e2.traversal.error === t2.traversal.error ? 0 : e2.traversal.error > t2.traversal.error ? -1 : 1 : e2.internal.hasUnrenderableContent ? -1 : 1 : e2.internal.loadingState > t2.internal.loadingState ? -1 : 1 : e2.internal.depthFromRenderedParent > t2.internal.depthFromRenderedParent ? 1 : -1 : e2.traversal.lastFrameVisited > t2.traversal.lastFrameVisited ? -1 : 1;
var H = (e2, t2) => {
  let n2 = e2.priority ?? Infinity, r2 = t2.priority ?? Infinity;
  if (n2 !== r2) return n2 > r2 ? 1 : -1;
  if (!e2.internal || !t2.internal) return 0;
  let i3 = e2.internal.renderer, a3 = t2.internal.renderer, o3 = !i3.loadAncestors, s3 = !a3.loadAncestors;
  return o3 && s3 ? B(e2, t2) : z(e2, t2);
};
var U = new o();
U.unloadPriorityCallback = V;
var W = new l();
W.maxJobsPerOrigin = 25, W.priorityCallback = H;
var G = new c();
G.maxJobs = 5, G.priorityCallback = H;
var K = new c();
K.maxJobs = 25, K.priorityCallback = (e2, t2) => {
  let n2 = e2.parent, r2 = t2.parent;
  return n2 === r2 ? 0 : n2 ? r2 ? H(n2, r2) : -1 : 1;
};
var ie = class {
  get root() {
    let e2 = this.rootTileset;
    return e2 ? e2.root : null;
  }
  get loadProgress() {
    let { stats: e2, isLoading: t2 } = this, n2 = e2.queued + e2.downloading + e2.parsing, r2 = e2.inCacheSinceLoad + +!!t2;
    return r2 === 0 ? 1 : 1 - n2 / r2;
  }
  get downloadQueue() {
    return this._downloadQueue;
  }
  set downloadQueue(e2) {
    if (e2 instanceof c) {
      console.warn('TilesRenderer: "downloadQueue" is no longer valid as a PriorityQueue. Use a DownloadPriorityQueue, instead.');
      return;
    }
    this._downloadQueue = e2;
  }
  constructor(e2 = null) {
    this.rootLoadingState = 0, this.rootTileset = null, this.rootURL = e2, this.fetchOptions = {}, this.plugins = [], this.queuedTiles = [], this.queuedTileSet = /* @__PURE__ */ new Set(), this.cachedSinceLoadComplete = /* @__PURE__ */ new Set(), this.isLoading = false, this.processedTiles = /* @__PURE__ */ new WeakSet(), this.visibleTiles = /* @__PURE__ */ new Set(), this.activeTiles = /* @__PURE__ */ new Set(), this.usedSet = /* @__PURE__ */ new Set(), this.loadingTiles = /* @__PURE__ */ new Set(), this.lruCache = U, this.downloadQueue = W, this.parseQueue = G, this.processNodeQueue = K, this.stats = {
      inCacheSinceLoad: 0,
      inCache: 0,
      queued: 0,
      downloading: 0,
      parsing: 0,
      loaded: 0,
      failed: 0,
      inFrustum: 0,
      used: 0,
      active: 0,
      visible: 0,
      refused: 0,
      tilesProcessed: 0
    }, this.frameCount = 0, this._dispatchNeedsUpdateEvent = ne(() => {
      this.dispatchEvent({ type: "needs-update" });
    }), this.errorTarget = 16, this.errorFalloff = 0, this.errorFalloffDensity = 2e-4, this.displayActiveTiles = false, this.maxDepth = Infinity, this.loadSiblings = true, this.loadAncestors = true, this.maxTilesProcessed = 250;
  }
  registerPlugin(e2) {
    if (e2[L2] === true) throw Error("TilesRendererBase: A plugin can only be registered to a single tileset");
    let t2 = this.plugins, n2 = e2.priority || 0, r2 = t2.length;
    for (let e3 = 0; e3 < t2.length; e3++) if ((t2[e3].priority || 0) > n2) {
      r2 = e3;
      break;
    }
    t2.splice(r2, 0, e2), e2[L2] = true, e2.init && e2.init(this);
  }
  unregisterPlugin(e2) {
    let t2 = this.plugins;
    if (typeof e2 == "string" && (e2 = this.getPluginByName(e2)), t2.includes(e2)) {
      let n2 = t2.indexOf(e2);
      return t2.splice(n2, 1), e2.dispose && e2.dispose(), true;
    }
    return false;
  }
  getPluginByName(e2) {
    return this.plugins.find((t2) => t2.name === e2) || null;
  }
  invokeOnePlugin(e2) {
    let t2 = [...this.plugins, this];
    for (let n2 = 0; n2 < t2.length; n2++) {
      let r2 = e2(t2[n2]);
      if (r2) return r2;
    }
    return null;
  }
  invokeAllPlugins(e2) {
    let t2 = [...this.plugins, this], n2 = [];
    for (let r2 = 0; r2 < t2.length; r2++) {
      let i3 = e2(t2[r2]);
      i3 && n2.push(i3);
    }
    return n2.length === 0 ? null : Promise.all(n2);
  }
  traverse(e2, t2, n2 = true) {
    this.root && F(this.root, (t3, ...r2) => (n2 && this.ensureChildrenArePreprocessed(t3, true), e2 ? e2(t3, ...r2) : false), t2);
  }
  getAttributions(e2 = []) {
    return this.invokeAllPlugins((t2) => t2 !== this && t2.getAttributions && t2.getAttributions(e2)), e2;
  }
  update() {
    let { lruCache: e2, usedSet: t2, stats: n2, root: r2, downloadQueue: i3, parseQueue: a3, processNodeQueue: o3, queuedTiles: s3, queuedTileSet: c3 } = this;
    if (this.rootLoadingState === 0 && (this.rootLoadingState = 2, this.invokeOnePlugin((e3) => e3.loadRootTileset && e3.loadRootTileset()).then((e3) => {
      let t3 = this.rootURL;
      t3 !== null && this.invokeAllPlugins((e4) => t3 = e4.preprocessURL ? e4.preprocessURL(t3, null) : t3), this.rootLoadingState = 4, this.rootTileset = e3, this.dispatchEvent({ type: "needs-update" }), this.dispatchEvent({
        type: "load-tileset",
        tileset: e3,
        url: t3
      }), this.dispatchEvent({
        type: "load-root-tileset",
        tileset: e3,
        url: t3
      });
    }).catch((e3) => {
      this.rootLoadingState = -1, console.error(e3), this.rootTileset = null, this.dispatchEvent({
        type: "load-error",
        tile: null,
        error: e3,
        url: this.rootURL
      });
    })), !r2) return;
    let l3 = null;
    if (this.invokeAllPlugins((e3) => {
      if (e3.doTilesNeedUpdate) {
        let t3 = e3.doTilesNeedUpdate();
        l3 = l3 === null ? t3 : !!(l3 || t3);
      }
    }), l3 === false) {
      this.dispatchEvent({ type: "update-before" }), this.dispatchEvent({ type: "update-after" });
      return;
    }
    this.dispatchEvent({ type: "update-before" }), n2.inFrustum = 0, n2.used = 0, n2.active = 0, n2.visible = 0, n2.refused = 0, n2.tilesProcessed = 0, this.frameCount++, t2.forEach((t3) => e2.markUnused(t3)), t2.clear(), this.prepareForTraversal(), te(r2, this), this.removeUnusedPendingTiles(), s3.sort(e2.unloadPriorityCallback);
    let u4 = 0, d5 = s3.length;
    for (; u4 < d5 && !e2.isFull(); u4++) this.requestTileContents(s3[u4]);
    n2.refused += s3.length - u4, s3.length = 0, c3.clear(), e2.scheduleUnload(), (i3.running || a3.running || o3.running) === false && this.isLoading === true && (this.cachedSinceLoadComplete.clear(), n2.inCacheSinceLoad = 0, this.dispatchEvent({ type: "tiles-load-end" }), this.isLoading = false), this.dispatchEvent({ type: "update-after" });
  }
  resetFailedTiles() {
    this.rootLoadingState === -1 && (this.rootLoadingState = 0);
    let e2 = this.stats;
    e2.failed !== 0 && (this.traverse((e3) => {
      e3.internal.loadingState === -1 && (e3.internal.loadingState = 0);
    }, null, false), e2.failed = 0);
  }
  calculateTileViewErrorWithPlugin(e2, t2) {
    this.calculateTileViewError(e2, t2);
    let { errorFalloff: n2, errorFalloffDensity: r2 } = this;
    if (n2 > 0 && Number.isFinite(t2.distanceFromCamera)) {
      let e3 = t2.distanceFromCamera * r2;
      t2.error -= n2 * (1 - Math.exp(-e3 * e3));
    }
    let i3 = null, a3 = 0, o3 = Infinity;
    this.invokeAllPlugins((t3) => {
      t3 !== this && t3.calculateTileViewError && (R.inView = true, R.error = 0, R.distance = Infinity, t3.calculateTileViewError(e2, R) && (i3 === null && (i3 = true), i3 && (i3 = R.inView), R.inView && (o3 = Math.min(o3, R.distance), a3 = Math.max(a3, R.error))));
    }), t2.inView && i3 !== false ? (t2.error = Math.max(t2.error, a3), t2.distanceFromCamera = Math.min(t2.distanceFromCamera, o3)) : i3 ? (t2.inView = true, t2.error = a3, t2.distanceFromCamera = o3) : t2.inView = false;
  }
  dispose() {
    [...this.plugins].forEach((e3) => {
      this.unregisterPlugin(e3);
    });
    let e2 = this.lruCache, t2 = [];
    this.traverse((e3) => (t2.push(e3), false), null, false);
    for (let n2 = 0, r2 = t2.length; n2 < r2; n2++) e2.remove(t2[n2]);
    this.stats = {
      queued: 0,
      parsing: 0,
      downloading: 0,
      failed: 0,
      inFrustum: 0,
      traversed: 0,
      used: 0,
      active: 0,
      visible: 0
    }, this.frameCount = 0, this.loadingTiles.clear();
  }
  calculateBytesUsed(e2, t2) {
    return 0;
  }
  dispatchEvent(e2) {
  }
  addEventListener(e2, t2) {
  }
  removeEventListener(e2, t2) {
  }
  parseTile(e2, t2, n2) {
    return null;
  }
  prepareForTraversal() {
  }
  disposeTile(e2) {
    e2.traversal.visible && (e2.internal.hasRenderableContent ? this.invokeOnePlugin((t3) => t3.setTileVisible && t3.setTileVisible(e2, false)) : this.invokeOnePlugin((t3) => t3.setEmptyTileVisible && t3.setEmptyTileVisible(e2, false)), e2.traversal.visible = false), e2.traversal.active && e2.internal.hasRenderableContent && this.invokeOnePlugin((t3) => t3.setTileActive && t3.setTileActive(e2, false)), e2.traversal.active = false;
    let { scene: t2 } = e2.engineData;
    t2 && this.dispatchEvent({
      type: "dispose-model",
      scene: t2,
      tile: e2
    });
  }
  preprocessNode(e2, t2, n2 = null) {
    if (this.processedTiles.add(e2), this.stats.tilesProcessed++, e2.content && (!("uri" in e2.content) && "url" in e2.content && (e2.content.uri = e2.content.url, delete e2.content.url), e2.content.boundingVolume && !("box" in e2.content.boundingVolume || "sphere" in e2.content.boundingVolume || "region" in e2.content.boundingVolume) && delete e2.content.boundingVolume), e2.parent = n2, e2.children = e2.children || [], e2.internal = {
      hasContent: false,
      hasRenderableContent: false,
      hasUnrenderableContent: false,
      loadingState: 0,
      basePath: t2,
      depth: -1,
      depthFromRenderedParent: -1,
      isVirtual: false,
      virtualChildCount: 0,
      renderer: this,
      ...e2.internal
    }, e2.content?.uri) {
      let t3 = r(e2.content.uri), n3 = !!(t3 && /json$/.test(t3));
      e2.internal.hasContent = true, e2.internal.hasUnrenderableContent = n3, e2.internal.hasRenderableContent = !n3;
    } else e2.internal.hasContent = false, e2.internal.hasUnrenderableContent = false, e2.internal.hasRenderableContent = false;
    n2 ? (e2.internal.depth = n2.internal.depth + 1, e2.internal.depthFromRenderedParent = n2.internal.depthFromRenderedParent + +!!e2.internal.hasRenderableContent) : (e2.internal.depth = 0, e2.internal.depthFromRenderedParent = +!!e2.internal.hasRenderableContent), e2.traversal = {
      distanceFromCamera: Infinity,
      error: Infinity,
      inFrustum: false,
      wasInFrustum: false,
      isLeaf: false,
      used: false,
      usedLastFrame: false,
      visible: false,
      wasSetVisible: false,
      active: false,
      wasSetActive: false,
      allChildrenReady: false,
      allChildrenLoaded: false,
      kicked: false,
      allUsedChildrenProcessed: false,
      lastFrameVisited: -1
    }, n2 === null ? e2.refine = e2.refine || "REPLACE" : e2.refine = e2.refine || n2.refine, e2.engineData = {
      scene: null,
      metadata: null,
      boundingVolume: null
    }, Object.defineProperty(e2, "cached", {
      get() {
        return console.warn('TilesRenderer: "tile.cached" field has been renamed to "tile.engineData".'), this.engineData;
      },
      enumerable: false,
      configurable: true
    }), this.invokeAllPlugins((r2) => {
      r2 !== this && r2.preprocessNode && r2.preprocessNode(e2, t2, n2);
    });
  }
  setTileActive(e2, t2) {
    t2 ? this.activeTiles.add(e2) : this.activeTiles.delete(e2);
  }
  setTileVisible(e2, t2) {
    t2 ? this.visibleTiles.add(e2) : this.visibleTiles.delete(e2), this.dispatchEvent({
      type: "tile-visibility-change",
      scene: e2.engineData.scene,
      tile: e2,
      visible: t2
    });
  }
  calculateTileViewError(e2, t2) {
  }
  removeUnusedPendingTiles() {
    let { lruCache: e2, loadingTiles: t2 } = this, n2 = [];
    for (let r2 of t2) !e2.isUsed(r2) && r2.internal.loadingState === 1 && n2.push(r2);
    for (let t3 = 0; t3 < n2.length; t3++) e2.remove(n2[t3]);
  }
  queueTileForDownload(e2) {
    let { queuedTileSet: t2 } = this;
    if (!(e2.internal.loadingState !== 0 || t2.has(e2))) {
      if (t2.add(e2), this.lruCache.isFull()) {
        this.stats.refused++;
        return;
      }
      this.queuedTiles.push(e2);
    }
  }
  markTileUsed(e2) {
    this.usedSet.add(e2), this.lruCache.markUsed(e2);
  }
  fetchData(e2, t2) {
    return fetch(e2, t2);
  }
  ensureChildrenArePreprocessed(e2, t2 = this.stats.tilesProcessed < this.maxTilesProcessed) {
    let n2 = e2.children;
    if (n2.length === 0 || n2[n2.length - 1].traversal) return;
    let r2 = (t3) => {
      for (let n3 = 0, r3 = t3.length; n3 < r3; n3++) {
        let r4 = t3[n3];
        r4 && !r4.traversal && this.preprocessNode(r4, e2.internal.basePath, e2);
      }
    };
    t2 ? (this.processNodeQueue.remove(e2), r2(n2)) : this.processNodeQueue.has(e2) || this.processNodeQueue.add(e2, (e3) => {
      r2(e3.children), this._dispatchNeedsUpdateEvent();
    });
  }
  getBytesUsed(e2) {
    let t2 = 0;
    return this.invokeAllPlugins((n2) => {
      n2.calculateBytesUsed && (t2 += n2.calculateBytesUsed(e2, e2.engineData.scene) || 0);
    }), t2;
  }
  recalculateBytesUsed(e2 = null) {
    let { lruCache: t2, processedTiles: n2 } = this;
    e2 === null ? t2.itemSet.forEach((e3) => {
      n2.has(e3) && t2.setMemoryUsage(e3, this.getBytesUsed(e3));
    }) : t2.setMemoryUsage(e2, this.getBytesUsed(e2));
  }
  preprocessTileset(e2, t2, n2 = null) {
    let [r2, i3] = e2.asset.version.split(".").map((e3) => parseInt(e3));
    console.assert(r2 <= 1, "TilesRenderer: asset.version is expected to be a 1.x or a compatible version."), r2 === 1 && i3 > 0 && console.warn("TilesRenderer: tiles versions at 1.1 or higher have limited support. Some new extensions and features may not be supported.");
    let a3 = t2.replace(/\/[^/]*$/, "");
    a3 = new URL(a3, window.location.href).toString(), this.preprocessNode(e2.root, a3, n2);
  }
  loadRootTileset() {
    let e2 = this.rootURL;
    return this.invokeAllPlugins((t2) => e2 = t2.preprocessURL ? t2.preprocessURL(e2, null) : e2), this.invokeOnePlugin((t2) => t2.fetchData && t2.fetchData(e2, this.fetchOptions)).then((t2) => {
      if (!(t2 instanceof Response)) return t2;
      if (t2.ok) return t2.json();
      throw Error(`TilesRenderer: Failed to load tileset "${e2}" with status ${t2.status} : ${t2.statusText}`);
    }).then((t2) => (this.preprocessTileset(t2, e2), t2));
  }
  requestTileContents(e2) {
    if (e2.internal.loadingState !== 0) return;
    let t2 = false, n2 = null, i3 = new URL(e2.content.uri, e2.internal.basePath + "/").toString();
    this.invokeAllPlugins((t3) => i3 = t3.preprocessURL ? t3.preprocessURL(i3, e2) : i3);
    let a3 = this.stats, o3 = this.lruCache, s3 = this.downloadQueue, c3 = this.parseQueue, l3 = this.loadingTiles, u4 = r(i3), d5 = new AbortController(), f4 = d5.signal;
    if (o3.add(e2, (n3) => {
      d5.abort(), t2 ? n3.children.length = 0 : this.invokeAllPlugins((e3) => {
        e3.disposeTile && e3.disposeTile(n3);
      }), a3.inCache--, this.cachedSinceLoadComplete.has(e2) && (this.cachedSinceLoadComplete.delete(e2), a3.inCacheSinceLoad--), n3.internal.loadingState === 1 ? a3.queued-- : n3.internal.loadingState === 2 ? a3.downloading-- : n3.internal.loadingState === 3 ? a3.parsing-- : n3.internal.loadingState === 4 && a3.loaded--, n3.internal.loadingState = 0, c3.remove(n3), s3.remove(n3), l3.delete(n3);
    })) return this.isLoading || (this.isLoading = true, this.dispatchEvent({ type: "tiles-load-start" })), o3.setMemoryUsage(e2, this.getBytesUsed(e2)), this.cachedSinceLoadComplete.add(e2), a3.inCacheSinceLoad++, a3.inCache++, a3.queued++, e2.internal.loadingState = 1, l3.add(e2), s3.add(i3, e2, (t3) => {
      if (f4.aborted) return Promise.resolve();
      e2.internal.loadingState = 2, a3.downloading++, a3.queued--;
      let n3 = this.invokeOnePlugin((e3) => e3.fetchData && e3.fetchData(i3, {
        ...this.fetchOptions,
        signal: f4
      }));
      return this.dispatchEvent({
        type: "tile-download-start",
        tile: e2,
        url: i3,
        get uri() {
          return console.warn('tile-download-start event: "uri" has been renamed to "url".'), this.url;
        }
      }), n3;
    }).then((e3) => {
      if (!f4.aborted) {
        if (!(e3 instanceof Response)) return e3;
        if (e3.ok) return u4 === "json" ? e3.json() : e3.arrayBuffer();
        throw Error(`Failed to load model with error code ${e3.status}`);
      }
    }).then((r2) => {
      if (!f4.aborted) return a3.downloading--, a3.parsing++, e2.internal.loadingState = 3, c3.add(e2, (a4) => f4.aborted ? Promise.resolve() : u4 === "json" && r2.root ? (this.preprocessTileset(r2, i3, e2), e2.children.push(r2.root), n2 = r2, t2 = true, Promise.resolve()) : this.invokeOnePlugin((e3) => e3.parseTile && e3.parseTile(r2, a4, u4, i3, f4)));
    }).then(() => {
      if (f4.aborted) return;
      a3.parsing--, a3.loaded++, e2.internal.loadingState = 4, l3.delete(e2), o3.setLoaded(e2, true);
      let r2 = this.getBytesUsed(e2);
      if (o3.getMemoryUsage(e2) === 0 && r2 > 0 && o3.isFull()) {
        o3.remove(e2);
        return;
      }
      o3.setMemoryUsage(e2, r2), this.dispatchEvent({ type: "needs-update" }), t2 && this.dispatchEvent({
        type: "load-tileset",
        tileset: n2,
        url: i3
      }), e2.engineData.scene && this.dispatchEvent({
        type: "load-model",
        scene: e2.engineData.scene,
        tile: e2,
        url: i3
      });
    }).catch((t3) => {
      f4.aborted || (t3.name === "AbortError" ? o3.remove(e2) : (c3.remove(e2), s3.remove(e2), e2.internal.loadingState === 1 ? a3.queued-- : e2.internal.loadingState === 2 ? a3.downloading-- : e2.internal.loadingState === 3 ? a3.parsing-- : e2.internal.loadingState === 4 && a3.loaded--, a3.failed++, console.error(`TilesRenderer : Failed to load tile at url "${e2.content.uri}".`), console.error(t3), e2.internal.loadingState = -1, l3.delete(e2), o3.setLoaded(e2, true), this.dispatchEvent({
        type: "load-error",
        tile: e2,
        error: t3,
        url: i3
      })));
    });
  }
};
function q(e2) {
  if (e2 === null || e2.byteLength < 4) return "";
  let t2;
  if (t2 = e2 instanceof DataView ? e2 : new DataView(e2), String.fromCharCode(t2.getUint8(0)) === "{") return null;
  let n2 = "";
  for (let e3 = 0; e3 < 4; e3++) n2 += String.fromCharCode(t2.getUint8(e3));
  return n2;
}
var oe = new TextDecoder();
function J(e2) {
  return oe.decode(e2);
}
function Y(e2) {
  return e2.replace(/[\\/][^\\/]+$/, "") + "/";
}
var X = class {
  constructor() {
    this.fetchOptions = {}, this.workingPath = "";
  }
  loadAsync(e2) {
    return fetch(e2, this.fetchOptions).then((t2) => {
      if (!t2.ok) throw Error(`Failed to load file "${e2}" with status ${t2.status} : ${t2.statusText}`);
      return t2.arrayBuffer();
    }).then((t2) => (this.workingPath === "" && (this.workingPath = Y(e2)), this.parse(t2)));
  }
  resolveExternalURL(e2) {
    return new URL(e2, this.workingPath).href;
  }
  parse(e2) {
    throw Error("LoaderBase: Parse not implemented.");
  }
};
function Z(e2, t2, n2, r2, i3, a3) {
  let o3;
  switch (r2) {
    case "SCALAR":
      o3 = 1;
      break;
    case "VEC2":
      o3 = 2;
      break;
    case "VEC3":
      o3 = 3;
      break;
    case "VEC4":
      o3 = 4;
      break;
    default:
      throw Error(`FeatureTable : Feature type not provided for "${a3}".`);
  }
  let s3, c3 = n2 * o3;
  switch (i3) {
    case "BYTE":
      s3 = new Int8Array(e2, t2, c3);
      break;
    case "UNSIGNED_BYTE":
      s3 = new Uint8Array(e2, t2, c3);
      break;
    case "SHORT":
      s3 = new Int16Array(e2, t2, c3);
      break;
    case "UNSIGNED_SHORT":
      s3 = new Uint16Array(e2, t2, c3);
      break;
    case "INT":
      s3 = new Int32Array(e2, t2, c3);
      break;
    case "UNSIGNED_INT":
      s3 = new Uint32Array(e2, t2, c3);
      break;
    case "FLOAT":
      s3 = new Float32Array(e2, t2, c3);
      break;
    case "DOUBLE":
      s3 = new Float64Array(e2, t2, c3);
      break;
    default:
      throw Error(`FeatureTable : Feature component type not provided for "${a3}".`);
  }
  return s3;
}
var Q = class {
  constructor(e2, t2, n2, r2) {
    this.buffer = e2, this.binOffset = t2 + n2, this.binLength = r2;
    let i3 = null;
    if (n2 !== 0) {
      let r3 = new Uint8Array(e2, t2, n2);
      i3 = JSON.parse(J(r3));
    } else i3 = {};
    this.header = i3;
  }
  getKeys() {
    return Object.keys(this.header).filter((e2) => e2 !== "extensions");
  }
  getData(e2, t2, n2 = null, r2 = null) {
    let i3 = this.header;
    if (!(e2 in i3)) return null;
    let a3 = i3[e2];
    if (!(a3 instanceof Object) || Array.isArray(a3)) return a3;
    {
      let { buffer: i4, binOffset: o3, binLength: s3 } = this, c3 = a3.byteOffset || 0, l3 = a3.type || r2, u4 = a3.componentType || n2;
      if ("type" in a3 && r2 && a3.type !== r2) throw Error("FeatureTable: Specified type does not match expected type.");
      let d5 = o3 + c3, f4 = Z(i4, d5, t2, l3, u4, e2);
      if (d5 + f4.byteLength > o3 + s3) throw Error("FeatureTable: Feature data read outside binary body length.");
      return f4;
    }
  }
  getBuffer(e2, t2) {
    let { buffer: n2, binOffset: r2 } = this;
    return n2.slice(r2 + e2, r2 + e2 + t2);
  }
};
var se = class {
  constructor(e2) {
    this.batchTable = e2;
    let t2 = e2.header.extensions["3DTILES_batch_table_hierarchy"];
    this.classes = t2.classes;
    for (let e3 of this.classes) {
      let t3 = e3.instances;
      for (let n3 in t3) e3.instances[n3] = this._parseProperty(t3[n3], e3.length, n3);
    }
    if (this.instancesLength = t2.instancesLength, this.classIds = this._parseProperty(t2.classIds, this.instancesLength, "classIds"), t2.parentCounts ? this.parentCounts = this._parseProperty(t2.parentCounts, this.instancesLength, "parentCounts") : this.parentCounts = Array(this.instancesLength).fill(1), t2.parentIds) {
      let e3 = this.parentCounts.reduce((e4, t3) => e4 + t3, 0);
      this.parentIds = this._parseProperty(t2.parentIds, e3, "parentIds");
    } else this.parentIds = null;
    this.instancesIds = [];
    let n2 = {};
    for (let e3 of this.classIds) n2[e3] = n2[e3] ?? 0, this.instancesIds.push(n2[e3]), n2[e3]++;
  }
  _parseProperty(e2, t2, n2) {
    if (Array.isArray(e2)) return e2;
    {
      let { buffer: r2, binOffset: i3 } = this.batchTable, a3 = e2.byteOffset, o3 = e2.componentType || "UNSIGNED_SHORT";
      return Z(r2, i3 + a3, t2, "SCALAR", o3, n2);
    }
  }
  getDataFromId(e2, t2 = {}) {
    let n2 = this.parentCounts[e2];
    if (this.parentIds && n2 > 0) {
      let r3 = 0;
      for (let t3 = 0; t3 < e2; t3++) r3 += this.parentCounts[t3];
      for (let i4 = 0; i4 < n2; i4++) {
        let n3 = this.parentIds[r3 + i4];
        n3 !== e2 && this.getDataFromId(n3, t2);
      }
    }
    let r2 = this.classIds[e2], i3 = this.classes[r2].instances, a3 = this.classes[r2].name, o3 = this.instancesIds[e2];
    for (let e3 in i3) t2[a3] = t2[a3] || {}, t2[a3][e3] = i3[e3][o3];
    return t2;
  }
};
var $ = class extends Q {
  constructor(e2, t2, n2, r2, i3) {
    super(e2, n2, r2, i3), this.count = t2, this.extensions = {};
    let a3 = this.header.extensions;
    a3 && a3["3DTILES_batch_table_hierarchy"] && (this.extensions["3DTILES_batch_table_hierarchy"] = new se(this));
  }
  getDataFromId(e2, t2 = {}) {
    if (e2 < 0 || e2 >= this.count) throw Error(`BatchTable: id value "${e2}" out of bounds for "${this.count}" features number.`);
    for (let n2 of this.getKeys()) t2[n2] = super.getData(n2, this.count)[e2];
    for (let n2 in this.extensions) {
      let r2 = this.extensions[n2];
      r2.getDataFromId instanceof Function && (t2[n2] = t2[n2] || {}, r2.getDataFromId(e2, t2[n2]));
    }
    return t2;
  }
  getPropertyArray(e2) {
    return super.getData(e2, this.count);
  }
};
var ce = class extends X {
  parse(e2) {
    let t2 = new DataView(e2), n2 = q(t2);
    console.assert(n2 === "b3dm");
    let r2 = t2.getUint32(4, true);
    console.assert(r2 === 1);
    let i3 = t2.getUint32(8, true);
    console.assert(i3 === e2.byteLength);
    let a3 = t2.getUint32(12, true), o3 = t2.getUint32(16, true), s3 = t2.getUint32(20, true), c3 = t2.getUint32(24, true), l3 = new Q(e2.slice(28, 28 + a3 + o3), 0, a3, o3), u4 = 28 + a3 + o3, d5 = new $(e2.slice(u4, u4 + s3 + c3), l3.getData("BATCH_LENGTH"), 0, s3, c3), f4 = u4 + s3 + c3;
    return {
      version: r2,
      featureTable: l3,
      batchTable: d5,
      glbBytes: new Uint8Array(e2, f4, i3 - f4)
    };
  }
};
var le = class extends X {
  parse(e2) {
    let t2 = new DataView(e2), n2 = q(t2);
    console.assert(n2 === "i3dm");
    let r2 = t2.getUint32(4, true);
    console.assert(r2 === 1);
    let i3 = t2.getUint32(8, true);
    console.assert(i3 === e2.byteLength);
    let a3 = t2.getUint32(12, true), o3 = t2.getUint32(16, true), s3 = t2.getUint32(20, true), c3 = t2.getUint32(24, true), l3 = t2.getUint32(28, true), u4 = new Q(e2.slice(32, 32 + a3 + o3), 0, a3, o3), d5 = 32 + a3 + o3, f4 = new $(e2.slice(d5, d5 + s3 + c3), u4.getData("INSTANCES_LENGTH"), 0, s3, c3), p4 = d5 + s3 + c3, m4 = new Uint8Array(e2, p4, i3 - p4), h5 = null, g5 = null, _6 = null;
    if (l3) h5 = m4, g5 = Promise.resolve();
    else {
      let e3 = this.resolveExternalURL(J(m4));
      _6 = Y(e3), g5 = fetch(e3, this.fetchOptions).then((t3) => {
        if (!t3.ok) throw Error(`I3DMLoaderBase : Failed to load file "${e3}" with status ${t3.status} : ${t3.statusText}`);
        return t3.arrayBuffer();
      }).then((e4) => {
        h5 = new Uint8Array(e4);
      });
    }
    return g5.then(() => ({
      version: r2,
      featureTable: u4,
      batchTable: f4,
      glbBytes: h5,
      gltfWorkingPath: _6
    }));
  }
};
var ue = class extends X {
  parse(e2) {
    let t2 = new DataView(e2), n2 = q(t2);
    console.assert(n2 === "pnts");
    let r2 = t2.getUint32(4, true);
    console.assert(r2 === 1);
    let i3 = t2.getUint32(8, true);
    console.assert(i3 === e2.byteLength);
    let a3 = t2.getUint32(12, true), o3 = t2.getUint32(16, true), s3 = t2.getUint32(20, true), c3 = t2.getUint32(24, true), l3 = new Q(e2.slice(28, 28 + a3 + o3), 0, a3, o3), u4 = 28 + a3 + o3, d5 = new $(e2.slice(u4, u4 + s3 + c3), l3.getData("BATCH_LENGTH") || l3.getData("POINTS_LENGTH"), 0, s3, c3);
    return Promise.resolve({
      version: r2,
      featureTable: l3,
      batchTable: d5
    });
  }
};
var de = class extends X {
  parse(e2) {
    let t2 = new DataView(e2), n2 = q(t2);
    console.assert(n2 === "cmpt", 'CMPTLoader: The magic bytes equal "cmpt".');
    let r2 = t2.getUint32(4, true);
    console.assert(r2 === 1, 'CMPTLoader: The version listed in the header is "1".');
    let i3 = t2.getUint32(8, true);
    console.assert(i3 === e2.byteLength, "CMPTLoader: The contents buffer length listed in the header matches the file.");
    let a3 = t2.getUint32(12, true), o3 = [], s3 = 16;
    for (let t3 = 0; t3 < a3; t3++) {
      let t4 = new DataView(e2, s3, 12), n3 = q(t4), r3 = t4.getUint32(4, true), i4 = t4.getUint32(8, true), a4 = new Uint8Array(e2, s3, i4);
      o3.push({
        type: n3,
        buffer: a4,
        version: r3
      }), s3 += i4;
    }
    return {
      version: r2,
      tiles: o3
    };
  }
};

// node_modules/3d-tiles-renderer/build/renderer-CUfHAmYW.js
import { Box3 as u, BufferAttribute as d, BufferGeometry as f, Clock as p, Color as m, DefaultLoadingManager as h, Euler as g2, EventDispatcher as _2, Frustum as v2, Group as y2, InstancedMesh as ee2, LoadingManager as b2, MathUtils as x2, Matrix3 as te2, Matrix4 as S2, Mesh as ne2, OrthographicCamera as re, PerspectiveCamera as ie2, Plane as ae, PlaneGeometry as oe2, Points as se2, PointsMaterial as ce2, Quaternion as C2, Ray as le2, Raycaster as ue2, ShaderMaterial as de2, Sphere as fe, Spherical as pe, TextureUtils as me, Vector2 as w2, Vector3 as T2 } from "three";
import { GLTFLoader as he } from "three/addons/loaders/GLTFLoader.js";
import { estimateBytesUsed as ge } from "three/addons/utils/BufferGeometryUtils.js";
var _e = class extends ce {
  constructor(e2 = h) {
    super(), this.manager = e2, this.adjustmentTransform = new S2();
  }
  parse(e2) {
    let t2 = super.parse(e2), n2 = t2.glbBytes.slice().buffer;
    return new Promise((e3, r2) => {
      let i3 = this.manager, a3 = this.fetchOptions, o3 = i3.getHandler("path.gltf") || new he(i3);
      a3.credentials === "include" && a3.mode === "cors" && o3.setCrossOrigin("use-credentials"), "credentials" in a3 && o3.setWithCredentials(a3.credentials === "include"), a3.headers && o3.setRequestHeader(a3.headers);
      let s3 = this.workingPath;
      !/[\\/]$/.test(s3) && s3.length && (s3 += "/");
      let c3 = this.adjustmentTransform;
      o3.parse(n2, s3, (n3) => {
        let { batchTable: r3, featureTable: i4 } = t2, { scene: a4 } = n3, o4 = i4.getData("RTC_CENTER", 1, "FLOAT", "VEC3");
        o4 && (a4.position.x += o4[0], a4.position.y += o4[1], a4.position.z += o4[2]), n3.scene.updateMatrix(), n3.scene.matrix.multiply(c3), n3.scene.matrix.decompose(n3.scene.position, n3.scene.quaternion, n3.scene.scale), n3.batchTable = r3, n3.featureTable = i4, a4.batchTable = r3, a4.featureTable = i4, e3(n3);
      }, r2);
    });
  }
};
function ve(e2) {
  let t2 = e2 >> 11, n2 = e2 >> 5 & 63, r2 = e2 & 31;
  return [
    Math.round(t2 / 31 * 255),
    Math.round(n2 / 63 * 255),
    Math.round(r2 / 31 * 255)
  ];
}
var ye = /* @__PURE__ */ new w2();
function be(e2, t2, n2 = new T2()) {
  ye.set(e2, t2).divideScalar(256).multiplyScalar(2).subScalar(1), n2.set(ye.x, ye.y, 1 - Math.abs(ye.x) - Math.abs(ye.y));
  let r2 = x2.clamp(-n2.z, 0, 1);
  return n2.x >= 0 ? n2.setX(n2.x - r2) : n2.setX(n2.x + r2), n2.y >= 0 ? n2.setY(n2.y - r2) : n2.setY(n2.y + r2), n2.normalize(), n2;
}
var xe = {
  RGB: "color",
  POSITION: "position"
};
var Se = class extends ue {
  constructor(e2 = h) {
    super(), this.manager = e2;
  }
  parse(e2) {
    return super.parse(e2).then(async (e3) => {
      let { featureTable: t2, batchTable: n2 } = e3, r2 = new ce2(), i3 = t2.header.extensions, a3 = new T2(), o3;
      if (i3 && i3["3DTILES_draco_point_compression"]) {
        let { byteOffset: e4, byteLength: n3, properties: a4 } = i3["3DTILES_draco_point_compression"], s4 = this.manager.getHandler("draco.drc");
        if (s4 == null) throw Error("PNTSLoader: dracoLoader not available.");
        let c4 = {};
        for (let e5 in a4) if (e5 in xe && e5 in a4) {
          let t3 = xe[e5];
          c4[t3] = a4[e5];
        }
        let l3 = {
          attributeIDs: c4,
          attributeTypes: {
            position: "Float32Array",
            color: "Uint8Array"
          },
          useUniqueIDs: true
        }, u4 = t2.getBuffer(e4, n3);
        o3 = await s4.decodeGeometry(u4, l3), o3.attributes.color && (r2.vertexColors = true);
      } else {
        let e4 = t2.getData("POINTS_LENGTH"), n3 = t2.getData("POSITION", e4, "FLOAT", "VEC3"), i4 = t2.getData("NORMAL", e4, "FLOAT", "VEC3"), s4 = t2.getData("NORMAL", e4, "UNSIGNED_BYTE", "VEC2"), c4 = t2.getData("RGB", e4, "UNSIGNED_BYTE", "VEC3"), l3 = t2.getData("RGBA", e4, "UNSIGNED_BYTE", "VEC4"), u4 = t2.getData("RGB565", e4, "UNSIGNED_SHORT", "SCALAR"), p4 = t2.getData("CONSTANT_RGBA", e4, "UNSIGNED_BYTE", "VEC4"), h5 = t2.getData("POSITION_QUANTIZED", e4, "UNSIGNED_SHORT", "VEC3"), g5 = t2.getData("QUANTIZED_VOLUME_SCALE", e4, "FLOAT", "VEC3"), _6 = t2.getData("QUANTIZED_VOLUME_OFFSET", e4, "FLOAT", "VEC3");
        if (o3 = new f(), h5) {
          let t3 = new Float32Array(e4 * 3);
          for (let n4 = 0; n4 < e4; n4++) for (let e5 = 0; e5 < 3; e5++) {
            let r3 = 3 * n4 + e5;
            t3[r3] = h5[r3] / 65535 * g5[e5];
          }
          a3.x = _6[0], a3.y = _6[1], a3.z = _6[2], o3.setAttribute("position", new d(t3, 3, false));
        } else o3.setAttribute("position", new d(n3, 3, false));
        if (i4 !== null) o3.setAttribute("normal", new d(i4, 3, false));
        else if (s4 !== null) {
          let t3 = new Float32Array(e4 * 3), n4 = new T2();
          for (let r3 = 0; r3 < e4; r3++) {
            let e5 = s4[r3 * 2], i5 = s4[r3 * 2 + 1], a4 = be(e5, i5, n4);
            t3[r3 * 3] = a4.x, t3[r3 * 3 + 1] = a4.y, t3[r3 * 3 + 2] = a4.z;
          }
          o3.setAttribute("normal", new d(t3, 3, false));
        }
        if (l3 !== null) o3.setAttribute("color", new d(l3, 4, true)), r2.vertexColors = true, r2.transparent = true, r2.depthWrite = false;
        else if (c4 !== null) o3.setAttribute("color", new d(c4, 3, true)), r2.vertexColors = true;
        else if (u4 !== null) {
          let t3 = new Uint8Array(e4 * 3);
          for (let n4 = 0; n4 < e4; n4++) {
            let e5 = ve(u4[n4]);
            for (let r3 = 0; r3 < 3; r3++) {
              let i5 = 3 * n4 + r3;
              t3[i5] = e5[r3];
            }
          }
          o3.setAttribute("color", new d(t3, 3, true)), r2.vertexColors = true;
        } else if (p4 !== null) {
          r2.color = new m(p4[0], p4[1], p4[2]);
          let e5 = p4[3] / 255;
          e5 < 1 && (r2.opacity = e5, r2.transparent = true, r2.depthWrite = false);
        }
      }
      let s3 = new se2(o3, r2);
      s3.position.copy(a3), e3.scene = s3, e3.scene.featureTable = t2, e3.scene.batchTable = n2;
      let c3 = t2.getData("RTC_CENTER", 1, "FLOAT", "VEC3");
      return c3 && (e3.scene.position.x += c3[0], e3.scene.position.y += c3[1], e3.scene.position.z += c3[2]), e3;
    });
  }
};
var Ce = /* @__PURE__ */ t({
  latitudeToSphericalPhi: () => Ae,
  sphericalPhiToLatitude: () => ke,
  swapToGeoFrame: () => De,
  swapToThreeFrame: () => Oe,
  toLatLonString: () => Ne
});
var we = /* @__PURE__ */ new pe();
var Te = /* @__PURE__ */ new T2();
var Ee = {};
function De(e2) {
  let { x: t2, y: n2, z: r2 } = e2;
  e2.x = r2, e2.y = t2, e2.z = n2;
}
function Oe(e2) {
  let { x: t2, y: n2, z: r2 } = e2;
  e2.z = t2, e2.x = n2, e2.y = r2;
}
function ke(e2) {
  return -(e2 - Math.PI / 2);
}
function Ae(e2) {
  return -e2 + Math.PI / 2;
}
function je(e2, t2, n2 = {}) {
  return we.theta = t2, we.phi = Ae(e2), Te.setFromSpherical(we), we.setFromVector3(Te), n2.lat = ke(we.phi), n2.lon = we.theta, n2;
}
function Me(e2, t2 = "E", n2 = "W") {
  let r2 = e2 < 0 ? n2 : t2;
  e2 = Math.abs(e2);
  let i3 = ~~e2, a3 = (e2 - i3) * 60, o3 = ~~a3;
  return `${i3}\xB0 ${o3}' ${~~((a3 - o3) * 60)}" ${r2}`;
}
function Ne(e2, t2, n2 = false) {
  let r2 = je(e2, t2, Ee), i3, a3;
  return n2 ? (i3 = `${(x2.RAD2DEG * r2.lat).toFixed(4)}\xB0`, a3 = `${(x2.RAD2DEG * r2.lon).toFixed(4)}\xB0`) : (i3 = Me(x2.RAD2DEG * r2.lat, "N", "S"), a3 = Me(x2.RAD2DEG * r2.lon, "E", "W")), `${i3} ${a3}`;
}
var Pe = /* @__PURE__ */ new pe();
var Fe = /* @__PURE__ */ new T2();
var E2 = /* @__PURE__ */ new T2();
var Ie = /* @__PURE__ */ new T2();
var D2 = /* @__PURE__ */ new S2();
var O2 = /* @__PURE__ */ new S2();
var Le = /* @__PURE__ */ new fe();
var k2 = /* @__PURE__ */ new g2();
var Re = /* @__PURE__ */ new T2();
var ze = /* @__PURE__ */ new T2();
var Be = /* @__PURE__ */ new T2();
var Ve = /* @__PURE__ */ new T2();
var He = /* @__PURE__ */ new le2();
var Ue = 1e-12;
var We = 0.1;
var Ge = 0;
var Ke = 1;
var qe = 2;
var Je = class {
  constructor(e2 = 1, t2 = 1, n2 = 1) {
    this.isEllipsoid = true, this.name = "", this.radius = new T2(e2, t2, n2);
  }
  intersectRay(e2, t2) {
    return D2.makeScale(...this.radius).invert(), Le.center.set(0, 0, 0), Le.radius = 1, He.copy(e2).applyMatrix4(D2), He.intersectSphere(Le, t2) ? (D2.makeScale(...this.radius), t2.applyMatrix4(D2), t2) : null;
  }
  getEastNorthUpFrame(e2, t2, n2, r2) {
    return n2.isMatrix4 && (r2 = n2, n2 = 0, console.warn('Ellipsoid: The signature for "getEastNorthUpFrame" has changed.')), this.getEastNorthUpAxes(e2, t2, Re, ze, Be), this.getCartographicToPosition(e2, t2, n2, Ve), r2.makeBasis(Re, ze, Be).setPosition(Ve);
  }
  getOrientedEastNorthUpFrame(e2, t2, n2, r2, i3, a3, o3) {
    return this.getObjectFrame(e2, t2, n2, r2, i3, a3, o3, 0);
  }
  getObjectFrame(e2, t2, n2, r2, i3, a3, o3, s3 = 2) {
    return this.getEastNorthUpFrame(e2, t2, n2, D2), k2.set(i3, a3, -r2, "ZXY"), o3.makeRotationFromEuler(k2).premultiply(D2), s3 === 1 ? (k2.set(Math.PI / 2, 0, 0, "XYZ"), O2.makeRotationFromEuler(k2), o3.multiply(O2)) : s3 === 2 && (k2.set(-Math.PI / 2, 0, Math.PI, "XYZ"), O2.makeRotationFromEuler(k2), o3.multiply(O2)), o3;
  }
  getCartographicFromObjectFrame(e2, t2, n2 = 2) {
    return n2 === 1 ? (k2.set(-Math.PI / 2, 0, 0, "XYZ"), O2.makeRotationFromEuler(k2).premultiply(e2)) : n2 === 2 ? (k2.set(-Math.PI / 2, 0, Math.PI, "XYZ"), O2.makeRotationFromEuler(k2).premultiply(e2)) : O2.copy(e2), Ve.setFromMatrixPosition(O2), this.getPositionToCartographic(Ve, t2), this.getEastNorthUpFrame(t2.lat, t2.lon, 0, D2).invert(), O2.premultiply(D2), k2.setFromRotationMatrix(O2, "ZXY"), t2.azimuth = -k2.z, t2.elevation = k2.x, t2.roll = k2.y, t2;
  }
  getEastNorthUpAxes(e2, t2, n2, r2, i3, a3 = Ve) {
    this.getCartographicToPosition(e2, t2, 0, a3), this.getCartographicToNormal(e2, t2, i3), n2.set(-a3.y, a3.x, 0).normalize(), r2.crossVectors(i3, n2).normalize();
  }
  getCartographicToPosition(e2, t2, n2, r2) {
    this.getCartographicToNormal(e2, t2, Fe);
    let i3 = this.radius;
    E2.copy(Fe), E2.x *= i3.x ** 2, E2.y *= i3.y ** 2, E2.z *= i3.z ** 2;
    let a3 = Math.sqrt(Fe.dot(E2));
    return E2.divideScalar(a3), r2.copy(E2).addScaledVector(Fe, n2);
  }
  getPositionToCartographic(e2, t2) {
    this.getPositionToSurfacePoint(e2, E2), this.getPositionToNormal(E2, Fe);
    let n2 = Ie.subVectors(e2, E2);
    return t2.lon = Math.atan2(Fe.y, Fe.x), t2.lat = Math.asin(Fe.z), t2.height = Math.sign(n2.dot(e2)) * n2.length(), t2;
  }
  getCartographicToNormal(e2, t2, n2) {
    return Pe.set(1, Ae(e2), t2), n2.setFromSpherical(Pe).normalize(), De(n2), n2;
  }
  getPositionToNormal(e2, t2) {
    let n2 = this.radius;
    return t2.copy(e2), t2.x /= n2.x ** 2, t2.y /= n2.y ** 2, t2.z /= n2.z ** 2, t2.normalize(), t2;
  }
  getPositionToSurfacePoint(e2, t2) {
    let n2 = this.radius, r2 = 1 / n2.x ** 2, i3 = 1 / n2.y ** 2, a3 = 1 / n2.z ** 2, o3 = e2.x * e2.x * r2, s3 = e2.y * e2.y * i3, c3 = e2.z * e2.z * a3, l3 = o3 + s3 + c3, u4 = Math.sqrt(1 / l3), d5 = E2.copy(e2).multiplyScalar(u4);
    if (l3 < We) return isFinite(u4) ? t2.copy(d5) : null;
    let f4 = Ie.set(d5.x * r2 * 2, d5.y * i3 * 2, d5.z * a3 * 2), p4 = (1 - u4) * e2.length() / (0.5 * f4.length()), m4 = 0, h5, g5, _6, v6, y6, ee4, b6, x6, te4, S5, ne4;
    do {
      p4 -= m4, _6 = 1 / (1 + p4 * r2), v6 = 1 / (1 + p4 * i3), y6 = 1 / (1 + p4 * a3), ee4 = _6 * _6, b6 = v6 * v6, x6 = y6 * y6, te4 = ee4 * _6, S5 = b6 * v6, ne4 = x6 * y6, h5 = o3 * ee4 + s3 * b6 + c3 * x6 - 1, g5 = o3 * te4 * r2 + s3 * S5 * i3 + c3 * ne4 * a3;
      let e3 = -2 * g5;
      m4 = h5 / e3;
    } while (Math.abs(h5) > Ue);
    return t2.set(e2.x * _6, e2.y * v6, e2.z * y6);
  }
  calculateHorizonDistance(e2, t2) {
    let n2 = this.calculateEffectiveRadius(e2);
    return Math.sqrt(2 * n2 * t2 + t2 ** 2);
  }
  calculateEffectiveRadius(e2) {
    let t2 = this.radius.x, n2 = 1 - this.radius.z ** 2 / t2 ** 2, r2 = e2 * x2.DEG2RAD, i3 = Math.sin(r2) ** 2;
    return t2 / Math.sqrt(1 - n2 * i3);
  }
  getPositionElevation(e2) {
    this.getPositionToSurfacePoint(e2, E2);
    let t2 = Ie.subVectors(e2, E2);
    return Math.sign(t2.dot(e2)) * t2.length();
  }
  closestPointToRayEstimate(e2, t2) {
    return this.intersectRay(e2, t2) ? t2 : (D2.makeScale(...this.radius).invert(), He.copy(e2).applyMatrix4(D2), E2.set(0, 0, 0), He.closestPointToPoint(E2, t2).normalize(), D2.makeScale(...this.radius), t2.applyMatrix4(D2));
  }
  copy(e2) {
    return this.radius.copy(e2.radius), this;
  }
  clone() {
    return new this.constructor().copy(this);
  }
};
var Ye = new Je(g, g, v);
Ye.name = "WGS84 Earth";
var Xe = /* @__PURE__ */ new T2();
var Ze = /* @__PURE__ */ new T2();
var Qe = /* @__PURE__ */ new T2();
var $e = /* @__PURE__ */ new T2();
var et = /* @__PURE__ */ new C2();
var tt = /* @__PURE__ */ new T2();
var nt = /* @__PURE__ */ new S2();
var rt = /* @__PURE__ */ new S2();
var it = /* @__PURE__ */ new T2();
var at = /* @__PURE__ */ new S2();
var ot = /* @__PURE__ */ new C2();
var st = {};
function ct(e2, t2, n2, r2) {
  if (e2 = e2 / n2 * 2 - 1, t2 = t2 / n2 * 2 - 1, r2.x = e2, r2.y = t2, r2.z = 1 - Math.abs(e2) - Math.abs(t2), r2.z < 0) {
    let e3 = r2.x;
    r2.x = (1 - Math.abs(r2.y)) * (e3 >= 0 ? 1 : -1), r2.y = (1 - Math.abs(e3)) * (r2.y >= 0 ? 1 : -1);
  }
  return r2.normalize(), r2;
}
var lt = class extends le {
  constructor(e2 = h) {
    super(), this.manager = e2, this.adjustmentTransform = new S2(), this.ellipsoid = Ye.clone();
  }
  resolveExternalURL(e2) {
    return this.manager.resolveURL(super.resolveExternalURL(e2));
  }
  parse(e2) {
    return super.parse(e2).then((e3) => {
      let { featureTable: t2, batchTable: n2 } = e3, r2 = e3.glbBytes.slice().buffer;
      return new Promise((i3, a3) => {
        let o3 = this.fetchOptions, s3 = this.manager, c3 = s3.getHandler("path.gltf") || new he(s3);
        o3.credentials === "include" && o3.mode === "cors" && c3.setCrossOrigin("use-credentials"), "credentials" in o3 && c3.setWithCredentials(o3.credentials === "include"), o3.headers && c3.setRequestHeader(o3.headers);
        let l3 = e3.gltfWorkingPath ?? this.workingPath;
        /[\\/]$/.test(l3) || (l3 += "/");
        let u4 = this.adjustmentTransform;
        c3.parse(r2, l3, (e4) => {
          let r3 = t2.getData("INSTANCES_LENGTH"), a4 = t2.getData("POSITION", r3, "FLOAT", "VEC3"), o4 = t2.getData("POSITION_QUANTIZED", r3, "UNSIGNED_SHORT", "VEC3"), s4 = t2.getData("QUANTIZED_VOLUME_OFFSET", 1, "FLOAT", "VEC3"), c4 = t2.getData("QUANTIZED_VOLUME_SCALE", 1, "FLOAT", "VEC3"), l4 = t2.getData("NORMAL_UP", r3, "FLOAT", "VEC3"), d5 = t2.getData("NORMAL_RIGHT", r3, "FLOAT", "VEC3"), f4 = t2.getData("NORMAL_UP_OCT32P", r3, "UNSIGNED_SHORT", "VEC2"), p4 = t2.getData("NORMAL_RIGHT_OCT32P", r3, "UNSIGNED_SHORT", "VEC2"), m4 = t2.getData("SCALE_NON_UNIFORM", r3, "FLOAT", "VEC3"), h5 = t2.getData("SCALE", r3, "FLOAT", "SCALAR"), g5 = t2.getData("RTC_CENTER", 1, "FLOAT", "VEC3"), _6 = t2.getData("EAST_NORTH_UP");
          if (!a4 && o4) {
            a4 = new Float32Array(r3 * 3);
            for (let e5 = 0; e5 < r3; e5++) a4[e5 * 3 + 0] = s4[0] + o4[e5 * 3 + 0] / 65535 * c4[0], a4[e5 * 3 + 1] = s4[1] + o4[e5 * 3 + 1] / 65535 * c4[1], a4[e5 * 3 + 2] = s4[2] + o4[e5 * 3 + 2] / 65535 * c4[2];
          }
          let v6 = new T2();
          for (let e5 = 0; e5 < r3; e5++) v6.x += a4[e5 * 3 + 0] / r3, v6.y += a4[e5 * 3 + 1] / r3, v6.z += a4[e5 * 3 + 2] / r3;
          let y6 = [], b6 = [];
          e4.scene.updateMatrixWorld(), e4.scene.traverse((e5) => {
            if (e5.isMesh) {
              b6.push(e5);
              let { geometry: t3, material: n3 } = e5, i4 = new ee2(t3, n3, r3);
              i4.position.copy(v6), g5 && (i4.position.x += g5[0], i4.position.y += g5[1], i4.position.z += g5[2]), y6.push(i4);
            }
          });
          for (let e5 = 0; e5 < r3; e5++) {
            $e.set(a4[e5 * 3 + 0] - v6.x, a4[e5 * 3 + 1] - v6.y, a4[e5 * 3 + 2] - v6.z), et.identity(), l4 && d5 ? (Ze.set(l4[e5 * 3 + 0], l4[e5 * 3 + 1], l4[e5 * 3 + 2]), Qe.set(d5[e5 * 3 + 0], d5[e5 * 3 + 1], d5[e5 * 3 + 2]), Xe.crossVectors(Qe, Ze).normalize(), nt.makeBasis(Qe, Ze, Xe), et.setFromRotationMatrix(nt)) : f4 && p4 && (ct(f4[e5 * 2 + 0], f4[e5 * 2 + 1], 65535, Ze), ct(p4[e5 * 2 + 0], p4[e5 * 2 + 1], 65535, Qe), Xe.crossVectors(Qe, Ze).normalize(), nt.makeBasis(Qe, Ze, Xe), et.setFromRotationMatrix(nt)), tt.set(1, 1, 1), m4 && tt.set(m4[e5 * 3 + 0], m4[e5 * 3 + 1], m4[e5 * 3 + 2]), h5 && tt.multiplyScalar(h5[e5]);
            for (let t3 = 0, n3 = y6.length; t3 < n3; t3++) {
              let n4 = y6[t3];
              ot.copy(et), _6 && (n4.updateMatrixWorld(), it.copy($e).applyMatrix4(n4.matrixWorld), this.ellipsoid.getPositionToCartographic(it, st), this.ellipsoid.getEastNorthUpFrame(st.lat, st.lon, at), ot.setFromRotationMatrix(at)), nt.compose($e, ot, tt).multiply(u4);
              let r4 = b6[t3];
              rt.multiplyMatrices(nt, r4.matrixWorld), n4.setMatrixAt(e5, rt);
            }
          }
          e4.scene.clear(), e4.scene.add(...y6), e4.batchTable = n2, e4.featureTable = t2, e4.scene.batchTable = n2, e4.scene.featureTable = t2, i3(e4);
        }, a3);
      });
    });
  }
};
var ut = class extends de {
  constructor(e2 = h) {
    super(), this.manager = e2, this.adjustmentTransform = new S2(), this.ellipsoid = Ye.clone();
  }
  parse(e2) {
    let t2 = super.parse(e2), { manager: n2, ellipsoid: r2, adjustmentTransform: i3 } = this, a3 = [];
    for (let e3 in t2.tiles) {
      let { type: o3, buffer: s3 } = t2.tiles[e3];
      switch (o3) {
        case "b3dm": {
          let e4 = s3.slice(), t3 = new _e(n2);
          t3.workingPath = this.workingPath, t3.fetchOptions = this.fetchOptions, t3.adjustmentTransform.copy(i3);
          let r3 = t3.parse(e4.buffer);
          a3.push(r3);
          break;
        }
        case "pnts": {
          let e4 = s3.slice(), t3 = new Se(n2);
          t3.workingPath = this.workingPath, t3.fetchOptions = this.fetchOptions;
          let r3 = t3.parse(e4.buffer);
          a3.push(r3);
          break;
        }
        case "i3dm": {
          let e4 = s3.slice(), t3 = new lt(n2);
          t3.workingPath = this.workingPath, t3.fetchOptions = this.fetchOptions, t3.ellipsoid.copy(r2), t3.adjustmentTransform.copy(i3);
          let o4 = t3.parse(e4.buffer);
          a3.push(o4);
          break;
        }
      }
    }
    return Promise.all(a3).then((e3) => {
      let t3 = new y2();
      return e3.forEach((e4) => {
        t3.add(e4.scene);
      }), {
        tiles: e3,
        scene: t3
      };
    });
  }
};
var dt = /* @__PURE__ */ new S2();
var ft = class extends y2 {
  constructor(e2) {
    super(), this.isTilesGroup = true, this.name = "TilesRenderer.TilesGroup", this.tilesRenderer = e2, this.matrixWorldInverse = new S2();
  }
  raycast(e2, t2) {
    return this.tilesRenderer.raycast(e2, t2), false;
  }
  updateMatrixWorld(e2) {
    if (this.matrixAutoUpdate && this.updateMatrix(), this.matrixWorldNeedsUpdate || e2) {
      this.parent === null ? dt.copy(this.matrix) : dt.multiplyMatrices(this.parent.matrixWorld, this.matrix), this.matrixWorldNeedsUpdate = false;
      let e3 = dt.elements, t2 = this.matrixWorld.elements, n2 = false;
      for (let r2 = 0; r2 < 16; r2++) {
        let i3 = e3[r2], a3 = t2[r2];
        if (Math.abs(i3 - a3) > 2 ** -52) {
          n2 = true;
          break;
        }
      }
      if (n2) {
        this.matrixWorld.copy(dt), this.matrixWorldInverse.copy(dt).invert();
        let e4 = this.children;
        for (let t4 = 0, n4 = e4.length; t4 < n4; t4++) e4[t4].updateMatrixWorld();
        let { tilesRenderer: t3 } = this, { activeTiles: n3, visibleTiles: r2 } = t3;
        n3.forEach((e5) => {
          r2.has(e5) || e5.engineData.scene.updateMatrixWorld(true);
        });
      }
    }
  }
  updateWorldMatrix(e2, t2) {
    this.parent && e2 && this.parent.updateWorldMatrix(e2, false), this.updateMatrixWorld(true);
  }
};
var pt = /* @__PURE__ */ new le2();
function mt(e2, t2, n2, r2) {
  let { scene: i3 } = e2.engineData;
  n2.invokeOnePlugin((n3) => n3.raycastTile && n3.raycastTile(e2, i3, t2, r2)) || t2.intersectObject(i3, true, r2);
}
function ht(e2) {
  return "traversal" in e2;
}
function gt(e2, t2, n2, r2, i3 = null) {
  if (!ht(t2)) return;
  let { group: a3, activeTiles: o3 } = e2, { boundingVolume: s3 } = t2.engineData;
  if (i3 === null && (i3 = pt, i3.copy(n2.ray).applyMatrix4(a3.matrixWorldInverse)), !t2.traversal.used || !s3.intersectsRay(i3)) return;
  o3.has(t2) && mt(t2, n2, e2, r2);
  let c3 = t2.children;
  for (let t3 = 0, a4 = c3.length; t3 < a4; t3++) gt(e2, c3[t3], n2, r2, i3);
}
var _t = /* @__PURE__ */ new T2();
var vt = /* @__PURE__ */ new T2();
var A2 = /* @__PURE__ */ new T2();
var yt = /* @__PURE__ */ new le2();
var bt = class {
  constructor(e2 = new u(), t2 = new S2()) {
    this.box = e2.clone(), this.transform = t2.clone(), this.inverseTransform = new S2(), this.points = Array(8).fill().map(() => new T2()), this.planes = [
      ,
      ,
      ,
      ,
      ,
      ,
    ].fill().map(() => new ae());
  }
  copy(e2) {
    return this.box.copy(e2.box), this.transform.copy(e2.transform), this.update(), this;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  clampPoint(e2, t2) {
    return t2.copy(e2).applyMatrix4(this.inverseTransform).clamp(this.box.min, this.box.max).applyMatrix4(this.transform);
  }
  distanceToPoint(e2) {
    return this.clampPoint(e2, A2).distanceTo(e2);
  }
  containsPoint(e2) {
    return A2.copy(e2).applyMatrix4(this.inverseTransform), this.box.containsPoint(A2);
  }
  intersectsRay(e2) {
    return yt.copy(e2).applyMatrix4(this.inverseTransform), yt.intersectsBox(this.box);
  }
  intersectRay(e2, t2) {
    return yt.copy(e2).applyMatrix4(this.inverseTransform), yt.intersectBox(this.box, t2) ? (t2.applyMatrix4(this.transform), t2) : null;
  }
  update() {
    let { points: e2, inverseTransform: t2, transform: n2, box: r2 } = this;
    t2.copy(n2).invert();
    let { min: i3, max: a3 } = r2, o3 = 0;
    for (let t3 = -1; t3 <= 1; t3 += 2) for (let r3 = -1; r3 <= 1; r3 += 2) for (let s3 = -1; s3 <= 1; s3 += 2) e2[o3].set(t3 < 0 ? i3.x : a3.x, r3 < 0 ? i3.y : a3.y, s3 < 0 ? i3.z : a3.z).applyMatrix4(n2), o3++;
    this.updatePlanes();
  }
  updatePlanes() {
    _t.copy(this.box.min).applyMatrix4(this.transform), vt.copy(this.box.max).applyMatrix4(this.transform), A2.set(0, 0, 1).transformDirection(this.transform), this.planes[0].setFromNormalAndCoplanarPoint(A2, _t), this.planes[1].setFromNormalAndCoplanarPoint(A2, vt).negate(), A2.set(0, 1, 0).transformDirection(this.transform), this.planes[2].setFromNormalAndCoplanarPoint(A2, _t), this.planes[3].setFromNormalAndCoplanarPoint(A2, vt).negate(), A2.set(1, 0, 0).transformDirection(this.transform), this.planes[4].setFromNormalAndCoplanarPoint(A2, _t), this.planes[5].setFromNormalAndCoplanarPoint(A2, vt).negate();
  }
  intersectsSphere(e2) {
    return this.clampPoint(e2.center, A2), A2.distanceToSquared(e2.center) <= e2.radius * e2.radius;
  }
  intersectsFrustum(e2) {
    return this._intersectsPlaneShape(e2.planes, e2.points);
  }
  intersectsOBB(e2) {
    return this._intersectsPlaneShape(e2.planes, e2.points);
  }
  _intersectsPlaneShape(e2, t2) {
    let n2 = this.points, r2 = this.planes;
    for (let t3 = 0; t3 < 6; t3++) {
      let r3 = e2[t3], i3 = -Infinity;
      for (let e3 = 0; e3 < 8; e3++) {
        let t4 = n2[e3], a3 = r3.distanceToPoint(t4);
        i3 = i3 < a3 ? a3 : i3;
      }
      if (i3 < 0) return false;
    }
    for (let e3 = 0; e3 < 6; e3++) {
      let n3 = r2[e3], i3 = -Infinity;
      for (let e4 = 0; e4 < 8; e4++) {
        let r3 = t2[e4], a3 = n3.distanceToPoint(r3);
        i3 = i3 < a3 ? a3 : i3;
      }
      if (i3 < 0) return false;
    }
    return true;
  }
};
var xt = Math.PI;
var St = xt / 2;
var Ct = /* @__PURE__ */ new T2();
var wt = /* @__PURE__ */ new T2();
var j2 = /* @__PURE__ */ new T2();
var M2 = /* @__PURE__ */ new T2();
var N2 = /* @__PURE__ */ new S2();
var Tt = /* @__PURE__ */ new u();
var Et = /* @__PURE__ */ new S2();
function Dt(e2, t2) {
  t2.radius = Math.max(t2.radius, e2.distanceToSquared(t2.center));
}
function Ot(e2) {
  return e2.x !== e2.y;
}
var kt = class extends Je {
  constructor(e2 = 1, t2 = 1, n2 = 1, r2 = -St, i3 = St, a3 = 0, o3 = 2 * xt, s3 = 0, c3 = 0) {
    super(e2, t2, n2), this.latStart = r2, this.latEnd = i3, this.lonStart = a3, this.lonEnd = o3, this.heightStart = s3, this.heightEnd = c3;
  }
  getBoundingBox(e2, t2) {
    Ot(this.radius) && console.warn("EllipsoidRegion: Triaxial ellipsoids are not supported.");
    let { latStart: n2, latEnd: r2, lonStart: i3, lonEnd: a3, heightStart: o3, heightEnd: s3 } = this, c3 = (n2 + r2) * 0.5, l3 = (i3 + a3) * 0.5, u4 = n2 > 0, d5 = r2 < 0, f4;
    f4 = u4 ? n2 : d5 ? r2 : 0;
    let { min: p4, max: m4 } = e2;
    p4.setScalar(Infinity), m4.setScalar(-Infinity), a3 - i3 <= xt ? (this.getCartographicToNormal(c3, l3, j2), wt.set(0, 0, 1), Ct.crossVectors(wt, j2).normalize(), wt.crossVectors(j2, Ct).normalize(), t2.makeBasis(Ct, wt, j2), N2.copy(t2).invert(), this.getCartographicToPosition(f4, i3, s3, M2).applyMatrix4(N2), m4.x = Math.abs(M2.x), p4.x = -m4.x, this.getCartographicToPosition(r2, i3, s3, M2).applyMatrix4(N2), m4.y = M2.y, this.getCartographicToPosition(r2, l3, s3, M2).applyMatrix4(N2), m4.y = Math.max(M2.y, m4.y), this.getCartographicToPosition(n2, i3, s3, M2).applyMatrix4(N2), p4.y = M2.y, this.getCartographicToPosition(n2, l3, s3, M2).applyMatrix4(N2), p4.y = Math.min(M2.y, p4.y), this.getCartographicToPosition(c3, l3, s3, M2).applyMatrix4(N2), m4.z = M2.z, this.getCartographicToPosition(n2, i3, o3, M2).applyMatrix4(N2), p4.z = M2.z, this.getCartographicToPosition(r2, i3, o3, M2).applyMatrix4(N2), p4.z = Math.min(M2.z, p4.z)) : (this.getCartographicToPosition(f4, l3, s3, j2), j2.z = 0, j2.length() < 1e-10 ? j2.set(1, 0, 0) : j2.normalize(), wt.set(0, 0, 1), Ct.crossVectors(j2, wt).normalize(), t2.makeBasis(Ct, wt, j2), N2.copy(t2).invert(), this.getCartographicToPosition(f4, l3 + St, s3, M2).applyMatrix4(N2), m4.x = Math.abs(M2.x), p4.x = -m4.x, this.getCartographicToPosition(r2, 0, d5 ? o3 : s3, M2).applyMatrix4(N2), m4.y = M2.y, this.getCartographicToPosition(n2, 0, u4 ? o3 : s3, M2).applyMatrix4(N2), p4.y = M2.y, this.getCartographicToPosition(f4, l3, s3, M2).applyMatrix4(N2), m4.z = M2.z, this.getCartographicToPosition(f4, a3, s3, M2).applyMatrix4(N2), p4.z = M2.z), e2.getCenter(M2), e2.min.sub(M2).multiplyScalar(1.0000000000001), e2.max.sub(M2).multiplyScalar(1.0000000000001), M2.applyMatrix4(t2), t2.setPosition(M2);
  }
  getBoundingSphere(e2) {
    Ot(this.radius) && console.warn("EllipsoidRegion: Triaxial ellipsoids are not supported."), this.getBoundingBox(Tt, Et), e2.center.setFromMatrixPosition(Et), e2.radius = 0;
    let { latStart: t2, latEnd: n2, lonStart: r2, lonEnd: i3, heightStart: a3, heightEnd: o3 } = this, s3 = (t2 + n2) * 0.5, c3 = (r2 + i3) * 0.5, l3 = t2 > 0, u4 = n2 < 0, d5;
    d5 = l3 ? t2 : u4 ? n2 : 0, this.getCartographicToPosition(d5, r2, o3, M2), Dt(M2, e2), this.getCartographicToPosition(n2, r2, o3, M2), Dt(M2, e2), this.getCartographicToPosition(n2, c3, o3, M2), Dt(M2, e2), this.getCartographicToPosition(t2, r2, o3, M2), Dt(M2, e2), this.getCartographicToPosition(t2, c3, o3, M2), Dt(M2, e2), this.getCartographicToPosition(s3, c3, o3, M2), Dt(M2, e2), this.getCartographicToPosition(t2, r2, a3, M2), Dt(M2, e2), i3 - r2 > xt && (this.getCartographicToPosition(d5, c3 + xt, o3, M2), Dt(M2, e2)), e2.radius = Math.sqrt(e2.radius) * 1.0000000000001;
  }
};
var P2 = /* @__PURE__ */ new T2();
var F2 = /* @__PURE__ */ new T2();
var I2 = /* @__PURE__ */ new T2();
var At = /* @__PURE__ */ new T2();
var jt = /* @__PURE__ */ new T2();
var Mt = class {
  constructor() {
    this.sphere = null, this.obb = null, this.region = null, this.regionObb = null;
  }
  intersectsRay(e2) {
    let t2 = this.sphere, n2 = this.obb || this.regionObb;
    return !(t2 && !e2.intersectsSphere(t2) || n2 && !n2.intersectsRay(e2));
  }
  intersectRay(e2, t2 = null) {
    let n2 = this.sphere, r2 = this.obb || this.regionObb, i3 = -Infinity, a3 = -Infinity;
    n2 && e2.intersectSphere(n2, At) && (i3 = n2.containsPoint(e2.origin) ? 0 : e2.origin.distanceToSquared(At)), r2 && r2.intersectRay(e2, jt) && (a3 = r2.containsPoint(e2.origin) ? 0 : e2.origin.distanceToSquared(jt));
    let o3 = Math.max(i3, a3);
    return o3 === -Infinity ? null : (e2.at(Math.sqrt(o3), t2), t2);
  }
  distanceToPoint(e2) {
    let t2 = this.sphere, n2 = this.obb || this.regionObb, r2 = -Infinity, i3 = -Infinity;
    return t2 && (r2 = Math.max(t2.distanceToPoint(e2), 0)), n2 && (i3 = n2.distanceToPoint(e2)), r2 > i3 ? r2 : i3;
  }
  intersectsFrustum(e2) {
    let t2 = this.obb || this.regionObb, n2 = this.sphere;
    return n2 && !e2.intersectsSphere(n2) || t2 && !t2.intersectsFrustum(e2) ? false : !!(n2 || t2);
  }
  intersectsSphere(e2) {
    let t2 = this.obb || this.regionObb, n2 = this.sphere;
    return n2 && !n2.intersectsSphere(e2) || t2 && !t2.intersectsSphere(e2) ? false : !!(n2 || t2);
  }
  intersectsOBB(e2) {
    let t2 = this.obb || this.regionObb, n2 = this.sphere;
    return n2 && !e2.intersectsSphere(n2) || t2 && !t2.intersectsOBB(e2) ? false : !!(n2 || t2);
  }
  getOBB(e2, t2) {
    let n2 = this.obb || this.regionObb;
    n2 ? (e2.copy(n2.box), t2.copy(n2.transform)) : (this.getAABB(e2), t2.identity());
  }
  getAABB(e2) {
    if (this.sphere) this.sphere.getBoundingBox(e2);
    else {
      let t2 = this.obb || this.regionObb;
      e2.copy(t2.box).applyMatrix4(t2.transform);
    }
  }
  getSphere(e2) {
    if (this.sphere) e2.copy(this.sphere);
    else if (this.region) this.region.getBoundingSphere(e2);
    else {
      let t2 = this.obb || this.regionObb;
      t2.box.getBoundingSphere(e2), e2.applyMatrix4(t2.transform);
    }
  }
  setObbData(e2, t2) {
    let n2 = new bt();
    P2.set(e2[3], e2[4], e2[5]), F2.set(e2[6], e2[7], e2[8]), I2.set(e2[9], e2[10], e2[11]);
    let r2 = P2.length(), i3 = F2.length(), a3 = I2.length();
    P2.normalize(), F2.normalize(), I2.normalize(), r2 === 0 && P2.crossVectors(F2, I2), i3 === 0 && F2.crossVectors(P2, I2), a3 === 0 && I2.crossVectors(P2, F2), n2.transform.set(P2.x, F2.x, I2.x, e2[0], P2.y, F2.y, I2.y, e2[1], P2.z, F2.z, I2.z, e2[2], 0, 0, 0, 1).premultiply(t2), n2.box.min.set(-r2, -i3, -a3), n2.box.max.set(r2, i3, a3), n2.update(), this.obb = n2;
  }
  setSphereData(e2, t2, n2, r2, i3) {
    let a3 = new fe();
    a3.center.set(e2, t2, n2), a3.radius = r2, a3.applyMatrix4(i3), this.sphere = a3;
  }
  setRegionData(e2, t2, n2, r2, i3, a3, o3) {
    let s3 = new kt(...e2.radius, n2, i3, t2, r2, a3, o3), c3 = new bt();
    s3.getBoundingBox(c3.box, c3.transform), c3.update(), this.region = s3, this.regionObb = c3;
  }
};
var Nt = /* @__PURE__ */ new te2();
function Pt(e2, t2, n2, r2) {
  let i3 = Nt.set(e2.normal.x, e2.normal.y, e2.normal.z, t2.normal.x, t2.normal.y, t2.normal.z, n2.normal.x, n2.normal.y, n2.normal.z);
  return r2.set(-e2.constant, -t2.constant, -n2.constant), r2.applyMatrix3(i3.invert()), r2;
}
var Ft = class extends v2 {
  constructor() {
    super(), this.points = Array(8).fill().map(() => new T2());
  }
  setFromProjectionMatrix(...e2) {
    return super.setFromProjectionMatrix(...e2), this.calculateFrustumPoints(), this;
  }
  calculateFrustumPoints() {
    let { planes: e2, points: t2 } = this;
    [
      [
        e2[0],
        e2[3],
        e2[4]
      ],
      [
        e2[1],
        e2[3],
        e2[4]
      ],
      [
        e2[0],
        e2[2],
        e2[4]
      ],
      [
        e2[1],
        e2[2],
        e2[4]
      ],
      [
        e2[0],
        e2[3],
        e2[5]
      ],
      [
        e2[1],
        e2[3],
        e2[5]
      ],
      [
        e2[0],
        e2[2],
        e2[5]
      ],
      [
        e2[1],
        e2[2],
        e2[5]
      ]
    ].forEach((e3, n2) => {
      Pt(e3[0], e3[1], e3[2], t2[n2]);
    });
  }
};
var It = /* @__PURE__ */ t({
  estimateBytesUsed: () => Bt,
  getTextureByteLength: () => zt
});
var Lt = 0;
function Rt(e2, t2, n2, r2) {
  try {
    return me.getByteLength(e2, t2, n2, r2);
  } catch {
    return Lt;
  }
}
function zt(e2) {
  if (!e2) return 0;
  if (e2.isExternalTexture) return e2.userData?.byteLength ?? Lt;
  let { format: t2, type: n2, image: r2, mipmaps: i3 } = e2;
  if (e2.isCompressedTexture && Array.isArray(i3) && i3.length > 0) {
    let e3 = 0;
    for (let r3 of i3) r3?.data?.byteLength ? e3 += r3.data.byteLength : e3 += Rt(r3.width, r3.height, t2, n2);
    return e3;
  }
  if (!r2) return Lt;
  let a3 = Rt(r2.width, r2.height, t2, n2);
  return a3 *= e2.generateMipmaps ? 4 / 3 : 1, a3;
}
function Bt(e2) {
  let t2 = /* @__PURE__ */ new Set(), n2 = 0;
  return e2.traverse((e3) => {
    if (e3.geometry && !t2.has(e3.geometry) && (n2 += ge(e3.geometry), t2.add(e3.geometry)), e3.material) {
      let r2 = e3.material;
      for (let e4 in r2) {
        let i3 = r2[e4];
        i3 && i3.isTexture && !t2.has(i3) && (n2 += zt(i3), t2.add(i3));
      }
    }
  }), n2;
}
var Vt = Symbol("INITIAL_FRUSTUM_CULLED");
var Ht = /* @__PURE__ */ new S2();
var Ut = /* @__PURE__ */ new T2();
var Wt = /* @__PURE__ */ new w2();
var Gt = /* @__PURE__ */ new T2(1, 0, 0);
var Kt = /* @__PURE__ */ new T2(0, 1, 0);
var qt = () => null;
function Jt(e2, t2) {
  e2.traverse((e3) => {
    e3.frustumCulled = e3[Vt] && t2;
  });
}
var Yt = class extends ie {
  get autoDisableRendererCulling() {
    return this._autoDisableRendererCulling;
  }
  set autoDisableRendererCulling(e2) {
    this._autoDisableRendererCulling !== e2 && (super._autoDisableRendererCulling = e2, this.forEachLoadedModel((t2) => {
      Jt(t2, !e2);
    }));
  }
  constructor(...e2) {
    super(...e2), this.accelerateRaycast = true, this.group = new ft(this), this.ellipsoid = Ye.clone(), this.surface = this.ellipsoid, this.cameras = [], this.cameraMap = /* @__PURE__ */ new Map(), this.cameraInfo = [], this._upRotationMatrix = new S2(), this._bytesUsed = /* @__PURE__ */ new WeakMap(), this._autoDisableRendererCulling = true, this.manager = new b2(), this._listeners = {};
  }
  addEventListener(e2, t2) {
    _2.prototype.addEventListener.call(this, e2, t2);
  }
  hasEventListener(e2, t2) {
    return _2.prototype.hasEventListener.call(this, e2, t2);
  }
  removeEventListener(e2, t2) {
    _2.prototype.removeEventListener.call(this, e2, t2);
  }
  dispatchEvent(e2) {
    _2.prototype.dispatchEvent.call(this, e2);
  }
  getBoundingBox(e2) {
    if (!this.root) return false;
    let t2 = this.root.engineData.boundingVolume;
    return t2 ? (t2.getAABB(e2), true) : false;
  }
  getOrientedBoundingBox(e2, t2) {
    if (!this.root) return false;
    let n2 = this.root.engineData.boundingVolume;
    return n2 ? (n2.getOBB(e2, t2), true) : false;
  }
  getBoundingSphere(e2) {
    if (!this.root) return false;
    let t2 = this.root.engineData.boundingVolume;
    return t2 ? (t2.getSphere(e2), true) : false;
  }
  forEachLoadedModel(e2) {
    this.traverse((t2) => {
      let n2 = t2.engineData && t2.engineData.scene;
      n2 && e2(n2, t2);
    }, null, false);
  }
  raycast(e2, t2) {
    if (this.root) if (this.accelerateRaycast) gt(this, this.root, e2, t2);
    else {
      let n2 = e2.firstHitOnly ? [] : t2;
      for (let t3 of this.activeTiles) {
        let { scene: r2 } = t3.engineData;
        this.invokeOnePlugin((i3) => i3.raycastTile && i3.raycastTile(t3, r2, e2, n2)) || e2.intersectObject(r2, true, n2);
      }
      e2.firstHitOnly && n2.length > 0 && (n2.sort((e3, t3) => e3.distance - t3.distance), t2.push(n2[0]));
    }
  }
  hasCamera(e2) {
    return this.cameraMap.has(e2);
  }
  setCamera(e2) {
    let t2 = this.cameras, n2 = this.cameraMap;
    return n2.has(e2) ? false : (n2.set(e2, new w2()), t2.push(e2), this.dispatchEvent({
      type: "add-camera",
      camera: e2
    }), true);
  }
  setResolution(e2, t2, n2) {
    let r2 = this.cameraMap;
    if (!r2.has(e2)) return false;
    let i3 = t2.isVector2 ? t2.x : t2, a3 = t2.isVector2 ? t2.y : n2, o3 = r2.get(e2);
    return (o3.width !== i3 || o3.height !== a3) && (o3.set(i3, a3), this.dispatchEvent({ type: "camera-resolution-change" })), true;
  }
  getResolution(e2, t2) {
    let n2 = this.cameraMap.get(e2);
    return n2 ? t2.copy(n2) : null;
  }
  setResolutionFromRenderer(e2, t2) {
    return t2.getSize(Wt), this.setResolution(e2, Wt.x, Wt.y);
  }
  deleteCamera(e2) {
    let t2 = this.cameras, n2 = this.cameraMap;
    if (n2.has(e2)) {
      let r2 = t2.indexOf(e2);
      return t2.splice(r2, 1), n2.delete(e2), this.dispatchEvent({
        type: "delete-camera",
        camera: e2
      }), true;
    }
    return false;
  }
  loadRootTileset(...e2) {
    return super.loadRootTileset(...e2).then((e3) => {
      let { asset: t2, extensions: n2 = {} } = e3;
      switch ((t2 && t2.gltfUpAxis || "y").toLowerCase()) {
        case "x":
          this._upRotationMatrix.makeRotationAxis(Kt, -Math.PI / 2);
          break;
        case "y":
          this._upRotationMatrix.makeRotationAxis(Gt, Math.PI / 2);
          break;
      }
      if ("3DTILES_ellipsoid" in n2) {
        let e4 = n2["3DTILES_ellipsoid"], { ellipsoid: t3 } = this;
        t3.name = e4.body, e4.radii ? t3.radius.set(...e4.radii) : t3.radius.set(1, 1, 1);
      }
      return e3;
    });
  }
  prepareForTraversal() {
    let e2 = this.group, t2 = this.cameras, n2 = this.cameraMap, r2 = this.cameraInfo;
    for (; r2.length > t2.length; ) r2.pop();
    for (; r2.length < t2.length; ) r2.push({
      frustum: new Ft(),
      isOrthographic: false,
      sseDenominator: -1,
      position: new T2(),
      invScale: -1,
      pixelSize: 0
    });
    Ut.setFromMatrixScale(e2.matrixWorldInverse), Math.abs(Math.max(Ut.x - Ut.y, Ut.x - Ut.z)) > 1e-6 && console.warn("ThreeTilesRenderer : Non uniform scale used for tile which may cause issues when calculating screen space error.");
    for (let i3 = 0, a3 = r2.length; i3 < a3; i3++) {
      let a4 = t2[i3], o3 = r2[i3], s3 = o3.frustum, c3 = o3.position, l3 = n2.get(a4);
      (l3.width === 0 || l3.height === 0) && console.warn("TilesRenderer: resolution for camera error calculation is not set.");
      let u4 = a4.projectionMatrix.elements;
      if (o3.isOrthographic = u4[15] === 1, o3.isOrthographic) {
        let e3 = 2 / u4[0], t3 = 2 / u4[5];
        o3.pixelSize = Math.max(t3 / l3.height, e3 / l3.width);
      } else o3.sseDenominator = 2 / u4[5] / l3.height;
      Ht.copy(e2.matrixWorld), Ht.premultiply(a4.matrixWorldInverse), Ht.premultiply(a4.projectionMatrix), s3.setFromProjectionMatrix(Ht, a4.coordinateSystem, a4.reversedDepth), c3.set(0, 0, 0), c3.applyMatrix4(a4.matrixWorld), c3.applyMatrix4(e2.matrixWorldInverse);
    }
  }
  update() {
    if (super.update(), this.cameras.length === 0 && this.root) {
      let e2 = false;
      this.invokeAllPlugins((t2) => e2 || (e2 = !!(t2 !== this && t2.calculateTileViewError))), e2 === false && console.warn("TilesRenderer: no cameras defined. Cannot update 3d tiles.");
    }
  }
  preprocessNode(e2, t2, n2 = null) {
    super.preprocessNode(e2, t2, n2);
    let r2 = new S2();
    if (e2.transform) {
      let t3 = e2.transform;
      for (let e3 = 0; e3 < 16; e3++) r2.elements[e3] = t3[e3];
    }
    n2 && r2.premultiply(n2.engineData.transform);
    let i3 = new S2().copy(r2).invert(), a3 = new Mt();
    "sphere" in e2.boundingVolume && a3.setSphereData(...e2.boundingVolume.sphere, r2), "box" in e2.boundingVolume && a3.setObbData(e2.boundingVolume.box, r2), "region" in e2.boundingVolume && a3.setRegionData(this.ellipsoid, ...e2.boundingVolume.region), e2.engineData.transform = r2, e2.engineData.transformInverse = i3, e2.engineData.boundingVolume = a3, e2.engineData.geometry = null, e2.engineData.materials = null, e2.engineData.textures = null, e2.toJSON = qt;
  }
  async parseTile(e2, t2, n2, a3, o3) {
    let s3 = t2.engineData, c3 = Y(a3), l3 = this.fetchOptions, u4 = this.manager, d5 = null, f4 = s3.transform, p4 = this._upRotationMatrix, m4 = (q(e2) || n2).toLowerCase();
    switch (m4) {
      case "b3dm": {
        let t3 = new _e(u4);
        t3.workingPath = c3, t3.fetchOptions = l3, t3.adjustmentTransform.copy(p4), d5 = t3.parse(e2);
        break;
      }
      case "pnts": {
        let t3 = new Se(u4);
        t3.workingPath = c3, t3.fetchOptions = l3, d5 = t3.parse(e2);
        break;
      }
      case "i3dm": {
        let t3 = new lt(u4);
        t3.workingPath = c3, t3.fetchOptions = l3, t3.adjustmentTransform.copy(p4), t3.ellipsoid.copy(this.ellipsoid), d5 = t3.parse(e2);
        break;
      }
      case "cmpt": {
        let t3 = new ut(u4);
        t3.workingPath = c3, t3.fetchOptions = l3, t3.adjustmentTransform.copy(p4), t3.ellipsoid.copy(this.ellipsoid), d5 = t3.parse(e2).then((e3) => e3.scene);
        break;
      }
      case "gltf":
      case "glb": {
        let t3 = u4.getHandler("path.gltf") || u4.getHandler("path.glb") || new he(u4);
        t3.setWithCredentials(l3.credentials === "include"), t3.setRequestHeader(l3.headers || {}), l3.credentials === "include" && l3.mode === "cors" && t3.setCrossOrigin("use-credentials");
        let n3 = t3.resourcePath || t3.path || c3;
        !/[\\/]$/.test(n3) && n3.length && (n3 += "/"), d5 = t3.parseAsync(e2, n3).then((e3) => {
          e3.scene = e3.scene || new y2();
          let { scene: t4 } = e3;
          return t4.updateMatrix(), t4.matrix.multiply(p4).decompose(t4.position, t4.quaternion, t4.scale), e3;
        });
        break;
      }
      default:
        d5 = this.invokeOnePlugin((r2) => r2.parseToMesh && r2.parseToMesh(e2, t2, n2, a3, o3));
        break;
    }
    let h5 = await d5;
    if (h5 === null) throw Error(`TilesRenderer: Content type "${m4}" not supported.`);
    let g5, _6;
    h5.isObject3D ? (g5 = h5, _6 = null) : (g5 = h5.scene, _6 = h5), g5.updateMatrix(), g5.matrix.premultiply(f4), g5.matrix.decompose(g5.position, g5.quaternion, g5.scale), await this.invokeAllPlugins((e3) => e3.processTileModel && e3.processTileModel(g5, t2)), g5.traverse((e3) => {
      e3[Vt] = e3.frustumCulled, e3.userData.tile = t2;
    }), Jt(g5, !this.autoDisableRendererCulling);
    let v6 = [], ee4 = [], b6 = [];
    if (g5.traverse((e3) => {
      if (e3.geometry && ee4.push(e3.geometry), e3.material) {
        let t3 = e3.material;
        v6.push(e3.material);
        for (let e4 in t3) {
          let n3 = t3[e4];
          n3 && n3.isTexture && b6.push(n3);
        }
      }
    }), o3.aborted) {
      for (let e3 = 0, t3 = b6.length; e3 < t3; e3++) {
        let t4 = b6[e3];
        t4.image instanceof ImageBitmap && t4.image.close(), t4.dispose();
      }
      return;
    }
    s3.materials = v6, s3.geometry = ee4, s3.textures = b6, s3.scene = g5, s3.metadata = _6;
  }
  disposeTile(e2) {
    super.disposeTile(e2);
    let t2 = e2.engineData;
    if (t2.scene) {
      let e3 = t2.materials, n2 = t2.geometry, r2 = t2.textures, i3 = t2.scene.parent;
      t2.scene.traverse((e4) => {
        e4.userData.meshFeatures && e4.userData.meshFeatures.dispose(), e4.userData.structuralMetadata && e4.userData.structuralMetadata.dispose();
      });
      for (let e4 = 0, t3 = n2.length; e4 < t3; e4++) n2[e4].dispose();
      for (let t3 = 0, n3 = e3.length; t3 < n3; t3++) e3[t3].dispose();
      for (let e4 = 0, t3 = r2.length; e4 < t3; e4++) {
        let t4 = r2[e4];
        t4.image instanceof ImageBitmap && t4.image.close(), t4.dispose();
      }
      i3 && i3.remove(t2.scene), t2.scene = null, t2.materials = null, t2.textures = null, t2.geometry = null, t2.metadata = null;
    }
  }
  setTileActive(e2, t2) {
    super.setTileActive(e2, t2);
    let n2 = e2.engineData.scene;
    n2 && (t2 ? (n2.parent = this.group, n2.updateMatrixWorld(true)) : this.visibleTiles.has(e2) || (n2.parent = null));
  }
  setTileVisible(e2, t2) {
    let n2 = e2.engineData.scene, { activeTiles: r2, group: i3 } = this;
    n2 && (t2 ? i3.add(n2) : (i3.remove(n2), r2.has(e2) && (n2.parent = i3))), super.setTileVisible(e2, t2);
  }
  calculateBytesUsed(e2, t2) {
    let n2 = this._bytesUsed;
    return !n2.has(e2) && t2 && n2.set(e2, Bt(t2)), n2.get(e2) ?? null;
  }
  calculateTileViewError(e2, t2) {
    let n2 = e2.engineData, r2 = this.cameras, i3 = this.cameraInfo, a3 = n2.boundingVolume, o3 = false, s3 = 0, c3 = Infinity, l3 = 0, u4 = Infinity;
    for (let t3 = 0, n3 = r2.length; t3 < n3; t3++) {
      let n4 = i3[t3], r3, d5;
      if (n4.isOrthographic) {
        let t4 = n4.pixelSize;
        r3 = e2.geometricError / t4, d5 = Infinity;
      } else {
        let t4 = n4.sseDenominator;
        d5 = a3.distanceToPoint(n4.position), r3 = d5 === 0 ? Infinity : e2.geometricError / (d5 * t4);
      }
      let f4 = i3[t3].frustum;
      a3.intersectsFrustum(f4) && (o3 = true, s3 = Math.max(s3, r3), c3 = Math.min(c3, d5)), l3 = Math.max(l3, r3), u4 = Math.min(u4, d5);
    }
    o3 ? (t2.inView = true, t2.error = s3, t2.distanceFromCamera = c3) : (t2.inView = false, t2.error = l3, t2.distanceFromCamera = u4);
  }
  dispose() {
    super.dispose(), this.group.removeFromParent();
  }
};
var Xt = class extends ne2 {
  constructor() {
    super(new oe2(0, 0), new Zt()), this.renderOrder = Infinity;
  }
  onBeforeRender(e2) {
    let t2 = this.material.uniforms;
    e2.getSize(t2.resolution.value);
  }
  updateMatrixWorld() {
    this.matrixWorld.makeTranslation(this.position);
  }
  dispose() {
    this.geometry.dispose(), this.material.dispose();
  }
};
var Zt = class extends de2 {
  constructor() {
    super({
      depthWrite: false,
      depthTest: false,
      transparent: true,
      uniforms: {
        resolution: { value: new w2() },
        size: { value: 15 },
        thickness: { value: 2 },
        opacity: { value: 1 }
      },
      vertexShader: "\n\n				uniform float size;\n				uniform float thickness;\n				uniform vec2 resolution;\n				varying vec2 vUv;\n\n				void main() {\n\n					vUv = uv;\n\n					float aspect = resolution.x / resolution.y;\n					vec2 offset = uv * 2.0 - vec2( 1.0 );\n					offset.y *= aspect;\n\n					vec4 screenPoint = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n					screenPoint.xy += offset * ( size + thickness ) * screenPoint.w / resolution.x;\n\n					gl_Position = screenPoint;\n\n				}\n			",
      fragmentShader: "\n\n				uniform float size;\n				uniform float thickness;\n				uniform float opacity;\n\n				varying vec2 vUv;\n				void main() {\n\n					float ht = 0.5 * thickness;\n					float planeDim = size + thickness;\n					float offset = ( planeDim - ht - 2.0 ) / planeDim;\n					float texelThickness = ht / planeDim;\n\n					vec2 vec = vUv * 2.0 - vec2( 1.0 );\n					float dist = abs( length( vec ) - offset );\n					float fw = fwidth( dist ) * 0.5;\n					float a = smoothstep( texelThickness - fw, texelThickness + fw, dist );\n\n					gl_FragColor = vec4( 1, 1, 1, opacity * ( 1.0 - a ) );\n\n				}\n			"
    });
  }
};
var Qt = /* @__PURE__ */ new w2();
var $t = /* @__PURE__ */ new w2();
var en = class {
  constructor() {
    this.domElement = null, this.buttons = 0, this.pointerType = null, this.pointerOrder = [], this.previousPositions = {}, this.pointerPositions = {}, this.startPositions = {}, this.pointerSetThisFrame = {}, this.hoverPosition = new w2(), this.hoverSet = false;
  }
  reset() {
    this.buttons = 0, this.pointerType = null, this.pointerOrder = [], this.previousPositions = {}, this.pointerPositions = {}, this.startPositions = {}, this.pointerSetThisFrame = {}, this.hoverPosition = new w2(), this.hoverSet = false;
  }
  updateFrame() {
    let { previousPositions: e2, pointerPositions: t2 } = this;
    for (let n2 in t2) e2[n2].copy(t2[n2]);
  }
  setHoverEvent(e2) {
    (e2.pointerType === "mouse" || e2.type === "wheel") && (this.getAdjustedPointer(e2, this.hoverPosition), this.hoverSet = true);
  }
  getLatestPoint(e2) {
    return this.pointerType === null ? this.hoverSet ? (e2.copy(this.hoverPosition), e2) : null : (this.getCenterPoint(e2), e2);
  }
  getAdjustedPointer(e2, t2) {
    let n2 = (this.domElement ? this.domElement : e2.target).getBoundingClientRect(), r2 = e2.clientX - n2.left, i3 = e2.clientY - n2.top;
    t2.set(r2, i3);
  }
  addPointer(e2) {
    let t2 = e2.pointerId, n2 = new w2();
    this.getAdjustedPointer(e2, n2), this.pointerOrder.push(t2), this.pointerPositions[t2] = n2, this.previousPositions[t2] = n2.clone(), this.startPositions[t2] = n2.clone(), this.getPointerCount() === 1 && (this.pointerType = e2.pointerType, this.buttons = e2.buttons);
  }
  updatePointer(e2) {
    let t2 = e2.pointerId;
    return t2 in this.pointerPositions ? (this.getAdjustedPointer(e2, this.pointerPositions[t2]), true) : false;
  }
  deletePointer(e2) {
    let t2 = e2.pointerId, n2 = this.pointerOrder;
    n2.splice(n2.indexOf(t2), 1), delete this.pointerPositions[t2], delete this.previousPositions[t2], delete this.startPositions[t2], this.getPointerCount() === 0 && (this.buttons = 0, this.pointerType = null);
  }
  getPointerCount() {
    return this.pointerOrder.length;
  }
  getCenterPoint(e2, t2 = this.pointerPositions) {
    let n2 = this.pointerOrder;
    if (this.getPointerCount() === 1 || this.getPointerType() === "mouse") {
      let r2 = n2[0];
      return e2.copy(t2[r2]), e2;
    } else if (this.getPointerCount() === 2) {
      let n3 = this.pointerOrder[0], r2 = this.pointerOrder[1], i3 = t2[n3], a3 = t2[r2];
      return e2.addVectors(i3, a3).multiplyScalar(0.5), e2;
    }
    return null;
  }
  getPreviousCenterPoint(e2) {
    return this.getCenterPoint(e2, this.previousPositions);
  }
  getStartCenterPoint(e2) {
    return this.getCenterPoint(e2, this.startPositions);
  }
  getMoveDistance() {
    return this.getCenterPoint(Qt), this.getPreviousCenterPoint($t), Qt.sub($t).length();
  }
  getTouchPointerDistance(e2 = this.pointerPositions) {
    if (this.getPointerCount() <= 1 || this.getPointerType() === "mouse") return 0;
    let { pointerOrder: t2 } = this, n2 = t2[0], r2 = t2[1], i3 = e2[n2], a3 = e2[r2];
    return i3.distanceTo(a3);
  }
  getPreviousTouchPointerDistance() {
    return this.getTouchPointerDistance(this.previousPositions);
  }
  getStartTouchPointerDistance() {
    return this.getTouchPointerDistance(this.startPositions);
  }
  getPointerType() {
    return this.pointerType;
  }
  isPointerTouch() {
    return this.getPointerType() === "touch";
  }
  getPointerButtons() {
    return this.buttons;
  }
  isLeftClicked() {
    return !!(this.buttons & 1);
  }
  isRightClicked() {
    return !!(this.buttons & 2);
  }
};
var tn = /* @__PURE__ */ new S2();
function nn(e2, t2, n2) {
  return n2.makeTranslation(-e2.x, -e2.y, -e2.z), tn.makeRotationFromQuaternion(t2), n2.premultiply(tn), tn.makeTranslation(e2.x, e2.y, e2.z), n2.premultiply(tn), n2;
}
function rn(e2, t2, n2) {
  n2.x = e2.x / t2.clientWidth * 2 - 1, n2.y = -(e2.y / t2.clientHeight) * 2 + 1, n2.isVector3 && (n2.z = 0);
}
function L3(e2, t2, n2) {
  let { origin: r2, direction: i3 } = e2 instanceof le2 ? e2 : e2.ray;
  r2.set(t2.x, t2.y, -1).unproject(n2), i3.set(t2.x, t2.y, 1).unproject(n2).sub(r2), e2.isRay || (e2.near = 0, e2.far = i3.length(), e2.camera = n2), i3.normalize();
}
var an = 0.05;
var on = 0.025;
var R2 = /* @__PURE__ */ new S2();
var sn = /* @__PURE__ */ new S2();
var z2 = /* @__PURE__ */ new T2();
var B2 = /* @__PURE__ */ new T2();
var cn = /* @__PURE__ */ new T2();
var ln = /* @__PURE__ */ new T2();
var V2 = /* @__PURE__ */ new T2();
var H2 = /* @__PURE__ */ new T2();
var un = /* @__PURE__ */ new T2();
var dn = /* @__PURE__ */ new T2();
var U2 = /* @__PURE__ */ new C2();
var fn = /* @__PURE__ */ new ae();
var W2 = /* @__PURE__ */ new T2();
var pn = /* @__PURE__ */ new T2();
var mn = /* @__PURE__ */ new T2();
var hn = /* @__PURE__ */ new C2();
var G2 = /* @__PURE__ */ new le2();
var gn = /* @__PURE__ */ new T2();
var _n = /* @__PURE__ */ new w2();
var K2 = /* @__PURE__ */ new w2();
var vn = /* @__PURE__ */ new w2();
var yn = /* @__PURE__ */ new w2();
var bn = /* @__PURE__ */ new w2();
var xn = /* @__PURE__ */ new w2();
var Sn = { type: "change" };
var Cn = { type: "start" };
var wn = { type: "end" };
var Tn = 300;
var En = 30;
var Dn = 5;
var On = 25e-4;
var kn = class extends _2 {
  get enabled() {
    return this._enabled;
  }
  set enabled(e2) {
    e2 !== this.enabled && (this._enabled = e2, this.resetState(), this.pointerTracker.reset(), this.enabled || (this.dragInertia.set(0, 0, 0), this.rotationInertia.set(0, 0)));
  }
  constructor(e2 = null, t2 = null, n2 = null) {
    super(), this.isEnvironmentControls = true, this.domElement = null, this.camera = null, this.scene = null, this.tilesRenderer = null, this._enabled = true, this.cameraRadius = 5, this.rotationSpeed = 1, this.minAltitude = 0, this.maxAltitude = 0.45 * Math.PI, this.minDistance = 10, this.maxDistance = Infinity, this.minZoom = 0, this.maxZoom = Infinity, this.zoomSpeed = 1, this.adjustHeight = true, this.enableDamping = false, this.dampingFactor = 0.15, this.enableDoubleTapZoom = true, this.doubleTapZoomScale = 2, this.doubleTapZoomDuration = 0.25, this.fallbackPlane = new ae(new T2(0, 1, 0), 0), this.useFallbackPlane = true, this.enableFlight = false, this.flightSpeed = 10, this.flightSpeedMultiplier = 4, this.scaleZoomOrientationAtEdges = false, this.autoAdjustCameraRotation = true, this.state = 0, this.pointerTracker = new en(), this.needsUpdate = false, this.actionHeightOffset = 0, this.pivotPoint = new T2(), this.zoomDirectionSet = false, this.zoomPointSet = false, this.zoomDirection = new T2(), this.zoomPoint = new T2(), this.zoomDelta = 0, this.rotationInertiaPivot = new T2(), this.rotationInertia = new w2(), this.dragInertia = new T2(), this.inertiaTargetDistance = Infinity, this.inertiaStableFrames = 0, this.pivotMesh = new Xt(), this.pivotMesh.raycast = () => {
    }, this.pivotMesh.scale.setScalar(0.25), this.raycaster = new ue2(), this.raycaster.firstHitOnly = true, this.up = new T2(0, 1, 0), this._lastTime = performance.now(), this._keysDown = /* @__PURE__ */ new Set(), this._detachCallback = null, this._upInitialized = false, this._lastUsedState = 0, this._zoomPointWasSet = false, this._doubleTapZoomActive = false, this._doubleTapZoomElapsed = 0, this._doubleTapPoint = new w2(), this._lastTapTime = -Infinity, this._lastTapPoint = new w2(), this._tilesOnChangeCallback = () => this.zoomPointSet = false, n2 && this.attach(n2), t2 && this.setCamera(t2), e2 && this.setScene(e2);
  }
  _getDeltaTime() {
    let e2 = performance.now(), t2 = e2 - this._lastTime;
    return this._lastTime = e2, t2 * 1e-3;
  }
  setScene(e2) {
    this.scene = e2;
  }
  setCamera(e2) {
    this.camera = e2, this._upInitialized = false, this.zoomDirectionSet = false, this.zoomPointSet = false, this.needsUpdate = true, this.raycaster.camera = e2, this.resetState();
  }
  attach(e2) {
    if (this.domElement) throw Error("EnvironmentControls: Controls already attached to element");
    this.domElement = e2, this.pointerTracker.domElement = e2, e2.style.touchAction = "none", e2.hasAttribute("tabindex") || (e2.tabIndex = -1);
    let t2 = (e3) => {
      this.enabled && e3.preventDefault();
    }, n2 = (e3) => {
      let { camera: t3, raycaster: n3, domElement: r3, up: i4, pivotMesh: a4, pointerTracker: o4, scene: s4, pivotPoint: c4, enabled: l4, enableFlight: u5, _keysDown: d6 } = this;
      if (!this.enabled) return;
      if (e3.preventDefault(), r3.focus(), o4.addPointer(e3), this.needsUpdate = true, this._cancelDoubleTapZoom(), o4.isPointerTouch()) {
        if (a4.visible = false, o4.getPointerCount() === 0) r3.setPointerCapture(e3.pointerId);
        else if (o4.getPointerCount() > 2) {
          this.resetState();
          return;
        }
      }
      o4.getCenterPoint(K2), rn(K2, r3, K2), L3(n3, K2, t3);
      let f4 = Math.abs(n3.ray.direction.dot(i4));
      if (f4 < an || f4 < on) return;
      let p4 = d6.has("w") || d6.has("s") || d6.has("a") || d6.has("d") || d6.has("q") || d6.has("e") || d6.has("arrowup") || d6.has("arrowdown") || d6.has("arrowleft") || d6.has("arrowright") || d6.has("shift");
      if (u5 && p4 && !o4.isPointerTouch() && (o4.isRightClicked() || o4.isLeftClicked())) {
        c4.copy(t3.position), this.setState(5);
        return;
      }
      let m4 = this._raycast(n3);
      m4 && (o4.getPointerCount() === 2 || o4.isRightClicked() || o4.isLeftClicked() && e3.shiftKey ? (c4.copy(m4.point), a4.position.copy(m4.point), a4.visible = o4.isPointerTouch() ? false : l4, a4.updateMatrixWorld(), s4.add(a4), this.setState(o4.isPointerTouch() ? 4 : 2)) : o4.isLeftClicked() && (c4.copy(m4.point), a4.position.copy(m4.point), a4.updateMatrixWorld(), s4.add(a4), this.setState(1)));
    }, r2 = false, i3 = (e3) => {
      let { pointerTracker: t3 } = this;
      if (!this.enabled) return;
      e3.preventDefault();
      let { pivotMesh: n3, enabled: i4 } = this;
      this.zoomDirectionSet = false, this.zoomPointSet = false, this.state !== 0 && (this.needsUpdate = true), t3.setHoverEvent(e3), t3.updatePointer(e3) && (t3.isPointerTouch() && t3.getPointerCount() === 2 && (r2 || (r2 = true, queueMicrotask(() => {
        r2 = false, t3.getCenterPoint(bn);
        let e4 = t3.getStartTouchPointerDistance(), a4 = t3.getTouchPointerDistance(), o4 = a4 - e4;
        if (this.state === 0 || this.state === 4) {
          t3.getCenterPoint(bn), t3.getStartCenterPoint(xn);
          let e5 = 2 * window.devicePixelRatio, n4 = bn.distanceTo(xn);
          (Math.abs(o4) > e5 || n4 > e5) && (Math.abs(o4) > n4 ? (this.setState(3), this.zoomDirectionSet = false) : this.setState(2));
        }
        if (this.state === 3) {
          let e5 = t3.getPreviousTouchPointerDistance();
          this.zoomDelta += a4 - e5, n3.visible = false;
        } else this.state === 2 && (n3.visible = i4);
      }))), this.dispatchEvent(Sn));
    }, a3 = (t3) => {
      let { pointerTracker: n3 } = this;
      if (!(!this.enabled || n3.getPointerCount() === 0)) {
        if (this.enableDoubleTapZoom && t3.button === 0 && n3.getPointerCount() === 1 && (n3.getCenterPoint(K2), n3.getStartCenterPoint(bn), K2.distanceTo(bn) < Dn * window.devicePixelRatio)) {
          let e3 = performance.now();
          e3 - this._lastTapTime < Tn && K2.distanceTo(this._lastTapPoint) < En * window.devicePixelRatio ? (this._lastTapTime = -Infinity, this._beginDoubleTapZoom(K2)) : (this._lastTapTime = e3, this._lastTapPoint.copy(K2));
        }
        n3.deletePointer(t3), n3.getPointerType() === "touch" && n3.getPointerCount() === 0 && e2.releasePointerCapture(t3.pointerId), this.resetState(), this.needsUpdate = true;
      }
    }, o3 = (e3) => {
      if (!this.enabled) return;
      e3.preventDefault(), this._cancelDoubleTapZoom();
      let { pointerTracker: t3 } = this;
      t3.setHoverEvent(e3), t3.updatePointer(e3), this.dispatchEvent(Cn);
      let n3;
      switch (e3.deltaMode) {
        case 2:
          n3 = e3.deltaY * 800;
          break;
        case 1:
          n3 = e3.deltaY * 40;
          break;
        case 0:
          n3 = e3.deltaY;
          break;
      }
      let r3 = Math.sign(n3), i4 = Math.abs(n3);
      this.zoomDelta -= 0.25 * r3 * i4, this.needsUpdate = true, this._lastUsedState = 3, this.dispatchEvent(wn);
    }, s3 = (e3) => {
      this.enabled && this.resetState();
    };
    e2.addEventListener("contextmenu", t2), e2.addEventListener("pointerdown", n2), e2.addEventListener("wheel", o3, { passive: false });
    let c3 = e2.getRootNode();
    c3.addEventListener("pointermove", i3), c3.addEventListener("pointerup", a3), c3.addEventListener("pointerleave", s3);
    let l3 = (e3) => {
      let { _keysDown: t3, state: n3 } = this;
      t3.add(e3.key.toLowerCase()), (t3.has("w") || t3.has("s") || t3.has("a") || t3.has("d") || t3.has("q") || t3.has("e") || t3.has("arrowup") || t3.has("arrowdown") || t3.has("arrowleft") || t3.has("arrowright")) && n3 !== 5 && this.resetState();
    }, u4 = (e3) => {
      this._keysDown.delete(e3.key.toLowerCase());
    }, d5 = () => {
      this._keysDown.clear();
    };
    e2.addEventListener("keydown", l3), window.addEventListener("keyup", u4), window.addEventListener("blur", d5), this._detachCallback = () => {
      e2.removeEventListener("contextmenu", t2), e2.removeEventListener("pointerdown", n2), e2.removeEventListener("wheel", o3), c3.removeEventListener("pointermove", i3), c3.removeEventListener("pointerup", a3), c3.removeEventListener("pointerleave", s3), e2.removeEventListener("keydown", l3), window.removeEventListener("keyup", u4), window.removeEventListener("blur", d5);
    };
  }
  detach() {
    this.domElement = null, this._detachCallback && (this._detachCallback(), this._detachCallback = null, this.pointerTracker.reset());
  }
  getUpDirection(e2, t2) {
    t2.copy(this.up);
  }
  getCameraUpDirection(e2) {
    this.getUpDirection(this.camera.position, e2);
  }
  getPivotPoint(e2) {
    let t2 = null;
    this._lastUsedState === 3 ? this._zoomPointWasSet && (t2 = e2.copy(this.zoomPoint)) : (this._lastUsedState === 2 || this._lastUsedState === 1) && (t2 = e2.copy(this.pivotPoint));
    let { camera: n2, raycaster: r2 } = this;
    t2 !== null && (B2.copy(t2).project(n2), (B2.x < -1 || B2.x > 1 || B2.y < -1 || B2.y > 1) && (t2 = null)), L3(r2, {
      x: 0,
      y: 0
    }, n2);
    let i3 = this._raycast(r2);
    return i3 && (t2 === null || i3.distance < t2.distanceTo(r2.ray.origin)) && (t2 = e2.copy(i3.point)), t2;
  }
  resetState() {
    this.state !== 0 && this.dispatchEvent(wn), this.state = 0, this.pivotMesh.removeFromParent(), this.pivotMesh.visible = this.enabled, this.actionHeightOffset = 0, this.pointerTracker.reset();
  }
  setState(e2 = this.state, t2 = true) {
    this.state !== e2 && (this.state === 0 && t2 && this.dispatchEvent(Cn), this.pivotMesh.visible = this.enabled, this.dragInertia.set(0, 0, 0), this.rotationInertia.set(0, 0), this.inertiaStableFrames = 0, this.state = e2, e2 !== 0 && e2 !== 4 && (this._lastUsedState = e2));
  }
  update(e2 = Math.min(this._getDeltaTime(), 64 / 1e3)) {
    if (!this.enabled || !this.camera || e2 === 0) return;
    let { camera: t2, cameraRadius: n2, pivotPoint: r2, up: i3, state: a3, adjustHeight: o3, autoAdjustCameraRotation: s3 } = this;
    t2.updateMatrixWorld(), this.getCameraUpDirection(W2), this._upInitialized || (this._upInitialized = true, this.up.copy(W2)), this.zoomPointSet = false, this._updateDoubleTapZoom(e2);
    let c3 = this._inertiaNeedsUpdate(), l3 = this.needsUpdate || c3;
    if (this.needsUpdate || c3) {
      let n3 = this.zoomDelta;
      this._updateZoom(), this._updatePosition(e2), this._updateRotation(e2), a3 === 1 || a3 === 2 || a3 === 5 ? (V2.set(0, 0, -1).transformDirection(t2.matrixWorld), this.inertiaTargetDistance = B2.copy(r2).sub(t2.position).dot(V2)) : a3 === 0 && this._updateInertia(e2), (a3 !== 0 || n3 !== 0 || c3) && this.dispatchEvent(Sn), this.needsUpdate = false;
    }
    let u4 = this._updateFlight(e2);
    u4 && (this.dragInertia.set(0, 0, 0), this.rotationInertia.set(0, 0, 0), this.dispatchEvent(Sn));
    let d5 = t2.isOrthographicCamera ? null : o3 && !u4 && this._getPointBelowCamera() || null;
    if (this.getCameraUpDirection(W2), this._setFrame(W2), (this.state === 1 || this.state === 2 || this.state === 5) && this.actionHeightOffset !== 0) {
      let { actionHeightOffset: e3 } = this;
      t2.position.addScaledVector(i3, -e3), r2.addScaledVector(i3, -e3), d5 && (d5.distance -= e3);
    }
    if (this.actionHeightOffset = 0, d5) {
      let e3 = d5.distance;
      if (e3 < n2) {
        let a4 = n2 - e3;
        t2.position.addScaledVector(i3, a4), r2.addScaledVector(i3, a4), this.actionHeightOffset = a4;
      }
    }
    this.pointerTracker.updateFrame(), (l3 && s3 || u4) && (this.getCameraUpDirection(W2), this._alignCameraUp(W2, 1), this.getCameraUpDirection(W2), this._clampRotation(W2));
  }
  adjustCamera(e2) {
    let { adjustHeight: t2, cameraRadius: n2 } = this;
    if (e2.isPerspectiveCamera) {
      this.getUpDirection(e2.position, W2);
      let r2 = t2 && this._getPointBelowCamera(e2.position, W2) || null;
      if (r2) {
        let t3 = r2.distance;
        t3 < n2 && e2.position.addScaledVector(W2, n2 - t3);
      }
    }
  }
  dispose() {
    this.detach();
  }
  _updateInertia(e2) {
    let { rotationInertia: t2, pivotPoint: n2, dragInertia: r2, enableDamping: i3, dampingFactor: a3, camera: o3, cameraRadius: s3, minDistance: c3, inertiaTargetDistance: l3 } = this;
    if (!this.enableDamping || this.inertiaStableFrames > 1) {
      r2.set(0, 0, 0), t2.set(0, 0, 0);
      return;
    }
    let u4 = 2 ** (-e2 / a3), d5 = Math.max(o3.near, s3, c3, l3), f4 = 2 / (2 * 1e3) * 0.25;
    if (t2.lengthSq() > 0) {
      L3(G2, B2.set(0, 0, -1), o3), G2.applyMatrix4(o3.matrixWorldInverse), G2.direction.normalize(), G2.recast(-G2.direction.dot(G2.origin)).at(d5 / G2.direction.z, B2), B2.applyMatrix4(o3.matrixWorld), L3(G2, z2.set(f4, f4, -1), o3), G2.applyMatrix4(o3.matrixWorldInverse), G2.direction.normalize(), G2.recast(-G2.direction.dot(G2.origin)).at(d5 / G2.direction.z, z2), z2.applyMatrix4(o3.matrixWorld), B2.sub(n2).normalize(), z2.sub(n2).normalize();
      let r3 = B2.angleTo(z2) / e2;
      t2.multiplyScalar(u4), (t2.lengthSq() < r3 ** 2 || !i3) && t2.set(0, 0);
    }
    if (r2.lengthSq() > 0) {
      L3(G2, B2.set(0, 0, -1), o3), G2.applyMatrix4(o3.matrixWorldInverse), G2.direction.normalize(), G2.recast(-G2.direction.dot(G2.origin)).at(d5 / G2.direction.z, B2), B2.applyMatrix4(o3.matrixWorld), L3(G2, z2.set(f4, f4, -1), o3), G2.applyMatrix4(o3.matrixWorldInverse), G2.direction.normalize(), G2.recast(-G2.direction.dot(G2.origin)).at(d5 / G2.direction.z, z2), z2.applyMatrix4(o3.matrixWorld);
      let t3 = B2.distanceTo(z2) / e2;
      r2.multiplyScalar(u4), (r2.lengthSq() < t3 ** 2 || !i3) && r2.set(0, 0, 0);
    }
    t2.lengthSq() > 0 && this._applyRotation(t2.x * e2, t2.y * e2, n2), r2.lengthSq() > 0 && (o3.position.addScaledVector(r2, e2), o3.updateMatrixWorld());
  }
  _inertiaNeedsUpdate() {
    let { rotationInertia: e2, dragInertia: t2 } = this;
    return e2.lengthSq() !== 0 || t2.lengthSq() !== 0;
  }
  _getFlightSpeedScale() {
    return 1;
  }
  _updateFlight(e2) {
    let { camera: t2, enableFlight: n2, flightSpeed: r2, flightSpeedMultiplier: i3, _keysDown: a3 } = this;
    if (!n2 || t2.isOrthographicCamera) return false;
    let o3 = a3.has("w") || a3.has("arrowup"), s3 = a3.has("s") || a3.has("arrowdown"), c3 = a3.has("a") || a3.has("arrowleft"), l3 = a3.has("d") || a3.has("arrowright"), u4 = a3.has("q"), d5 = a3.has("e"), f4 = (a3.has("shift") ? i3 : 1) * r2 * this._getFlightSpeedScale() * e2;
    return gn.set(!!l3 - +!!c3, !!u4 - +!!d5, !!s3 - +!!o3), gn.lengthSq() === 0 ? false : (gn.normalize().transformDirection(t2.matrixWorld), t2.position.addScaledVector(gn, f4), t2.updateMatrixWorld(), true);
  }
  _updateZoom() {
    let { zoomPoint: e2, zoomDirection: t2, camera: n2, minDistance: r2, maxDistance: i3, pointerTracker: a3, domElement: o3, minZoom: s3, maxZoom: c3, zoomSpeed: l3, state: u4 } = this, d5 = this.zoomDelta;
    if (this.zoomDelta = 0, !(!a3.getLatestPoint(K2) || d5 === 0 && u4 !== 3)) if (this.rotationInertia.set(0, 0), this.dragInertia.set(0, 0, 0), n2.isOrthographicCamera) {
      this._updateZoomDirection();
      let e3 = this.zoomPointSet || this._updateZoomPoint();
      rn(K2, o3, pn), pn.unproject(n2);
      let t3 = 0.95 ** (-l3 * d5 * 0.05);
      t3 > 1 ? c3 < n2.zoom * t3 && (t3 = 1) : s3 > n2.zoom * t3 && (t3 = 1), n2.zoom *= t3, n2.updateProjectionMatrix(), e3 && (rn(K2, o3, mn), mn.unproject(n2), n2.position.sub(mn).add(pn), n2.updateMatrixWorld());
    } else {
      this._updateZoomDirection();
      let a4 = B2.copy(t2);
      if (this.zoomPointSet || this._updateZoomPoint()) {
        let a5 = e2.distanceTo(n2.position);
        if (d5 < 0) {
          let e3 = Math.min(0, a5 - i3);
          d5 = d5 * a5 * l3 * On, d5 = Math.max(d5, e3);
        } else {
          let e3 = Math.max(0, a5 - r2);
          d5 = d5 * Math.max(a5 - r2, 0) * l3 * On, d5 = Math.min(d5, e3);
        }
        n2.position.addScaledVector(t2, d5), n2.updateMatrixWorld();
      } else {
        let e3 = this._getPointBelowCamera();
        if (e3) {
          let t3 = e3.distance;
          a4.set(0, 0, -1).transformDirection(n2.matrixWorld), n2.position.addScaledVector(a4, d5 * t3 * 0.01), n2.updateMatrixWorld();
        } else n2.position.addScaledVector(t2, d5), n2.updateMatrixWorld();
      }
    }
  }
  _beginDoubleTapZoom(e2) {
    let { camera: t2, raycaster: n2, domElement: r2 } = this;
    rn(e2, r2, bn), L3(n2, bn, t2);
    let i3 = this._raycast(n2);
    i3 !== null && (this.zoomPoint.copy(i3.point), this.zoomPointSet = true, this.zoomDirection.copy(n2.ray.direction).normalize(), this.zoomDirectionSet = true, this._doubleTapPoint.copy(e2), this._doubleTapZoomActive = true, this._doubleTapZoomElapsed = 0, this.needsUpdate = true, this.dispatchEvent(Cn));
  }
  _updateDoubleTapZoom(e2) {
    if (!this._doubleTapZoomActive) return;
    let { doubleTapZoomDuration: t2, doubleTapZoomScale: n2, zoomSpeed: r2, pointerTracker: i3 } = this;
    i3.getLatestPoint(K2) === null && (i3.hoverPosition.copy(this._doubleTapPoint), i3.hoverSet = true);
    let a3 = Math.log(n2) / (On * r2), o3 = (e3) => 1 - (1 - x2.clamp(e3, 0, 1)) ** 3, s3 = o3(this._doubleTapZoomElapsed / t2);
    this._doubleTapZoomElapsed += e2;
    let c3 = o3(this._doubleTapZoomElapsed / t2);
    this.zoomDelta += a3 * (c3 - s3), this.needsUpdate = true, this._doubleTapZoomElapsed >= t2 && (this._doubleTapZoomActive = false, this.dispatchEvent(wn));
  }
  _cancelDoubleTapZoom() {
    this._doubleTapZoomActive && (this._doubleTapZoomActive = false, this.dispatchEvent(wn));
  }
  _updateZoomDirection() {
    if (this.zoomDirectionSet) return;
    let { domElement: e2, raycaster: t2, camera: n2, zoomDirection: r2, pointerTracker: i3 } = this;
    i3.getLatestPoint(K2), rn(K2, e2, pn), L3(t2, pn, n2), r2.copy(t2.ray.direction).normalize(), this.zoomDirectionSet = true;
  }
  _updateZoomPoint() {
    let { camera: e2, zoomDirectionSet: t2, zoomDirection: n2, raycaster: r2, zoomPoint: i3, pointerTracker: a3, domElement: o3 } = this;
    if (this._zoomPointWasSet = false, !t2) return false;
    e2.isOrthographicCamera && a3.getLatestPoint(_n) ? (rn(_n, o3, _n), L3(r2, _n, e2)) : (r2.ray.origin.copy(e2.position), r2.ray.direction.copy(n2), r2.near = 0, r2.far = Infinity);
    let s3 = this._raycast(r2);
    return s3 ? (i3.copy(s3.point), this.zoomPointSet = true, this._zoomPointWasSet = true, true) : false;
  }
  _getPointBelowCamera(e2 = this.camera.position, t2 = this.up) {
    let { raycaster: n2 } = this;
    n2.ray.direction.copy(t2).multiplyScalar(-1), n2.ray.origin.copy(e2).addScaledVector(t2, 1e5), n2.near = 0, n2.far = Infinity;
    let r2 = this._raycast(n2);
    return r2 && (r2.distance -= 1e5), r2;
  }
  _updatePosition(e2) {
    let { raycaster: t2, camera: n2, pivotPoint: r2, up: i3, pointerTracker: a3, domElement: o3, state: s3, dragInertia: c3 } = this;
    if (s3 === 1) {
      if (a3.getCenterPoint(K2), rn(K2, o3, K2), fn.setFromNormalAndCoplanarPoint(i3, r2), L3(t2, K2, n2), Math.abs(t2.ray.direction.dot(i3)) < an) {
        let e3 = Math.acos(an);
        dn.crossVectors(t2.ray.direction, i3).normalize(), t2.ray.direction.copy(i3).applyAxisAngle(dn, e3).multiplyScalar(-1);
      }
      if (this.getUpDirection(r2, W2), Math.abs(t2.ray.direction.dot(W2)) < on) {
        let e3 = Math.acos(on);
        dn.crossVectors(t2.ray.direction, W2).normalize(), t2.ray.direction.copy(W2).applyAxisAngle(dn, e3).multiplyScalar(-1);
      }
      t2.ray.intersectPlane(fn, B2) && (z2.subVectors(r2, B2), n2.position.add(z2), n2.updateMatrixWorld(), z2.multiplyScalar(1 / e2), a3.getMoveDistance() / e2 < 2 * window.devicePixelRatio ? this.inertiaStableFrames++ : (c3.copy(z2), this.inertiaStableFrames = 0));
    }
  }
  _updateRotation(e2) {
    let { pivotPoint: t2, pointerTracker: n2, domElement: r2, state: i3, rotationInertia: a3 } = this;
    (i3 === 2 || i3 === 5) && (i3 === 5 && t2.copy(this.camera.position), n2.getCenterPoint(K2), n2.getPreviousCenterPoint(vn), yn.subVectors(K2, vn).multiplyScalar(2 * Math.PI / r2.clientHeight), this._applyRotation(yn.x, yn.y, t2), yn.multiplyScalar(1 / e2), n2.getMoveDistance() / e2 < 2 * window.devicePixelRatio ? this.inertiaStableFrames++ : (a3.copy(yn), this.inertiaStableFrames = 0));
  }
  _applyRotation(e2, t2, n2) {
    if (e2 === 0 && t2 === 0) return;
    let { camera: r2, minAltitude: i3, maxAltitude: a3, rotationSpeed: o3 } = this, s3 = -e2 * o3, c3 = t2 * o3;
    V2.set(0, 0, 1).transformDirection(r2.matrixWorld), H2.set(1, 0, 0).transformDirection(r2.matrixWorld), this.getUpDirection(n2, W2);
    let l3;
    W2.dot(V2) > 0.9999999999 ? l3 = 0 : (B2.crossVectors(W2, V2).normalize(), l3 = Math.sign(B2.dot(H2)) * W2.angleTo(V2)), c3 > 0 ? (c3 = Math.min(l3 - i3, c3), c3 = Math.max(0, c3)) : (c3 = Math.max(l3 - a3, c3), c3 = Math.min(0, c3)), U2.setFromAxisAngle(W2, s3), nn(n2, U2, R2), r2.matrixWorld.premultiply(R2), H2.set(1, 0, 0).transformDirection(r2.matrixWorld), U2.setFromAxisAngle(H2, -c3), nn(n2, U2, R2), r2.matrixWorld.premultiply(R2), r2.matrixWorld.decompose(r2.position, r2.quaternion, B2);
  }
  _setFrame(e2) {
    let { up: t2, camera: n2, zoomPoint: r2, zoomDirectionSet: i3, zoomPointSet: a3, scaleZoomOrientationAtEdges: o3 } = this;
    if (i3 && (a3 || this._updateZoomPoint())) {
      if (U2.setFromUnitVectors(t2, e2), o3) {
        this.getUpDirection(r2, B2);
        let e3 = Math.max(B2.dot(t2) - 0.6, 0) / 0.4;
        e3 = x2.mapLinear(e3, 0, 0.5, 0, 1), e3 = Math.min(e3, 1), n2.isOrthographicCamera && (e3 *= 0.1), U2.slerp(hn, 1 - e3);
      }
      nn(r2, U2, R2), n2.updateMatrixWorld(), n2.matrixWorld.premultiply(R2), n2.matrixWorld.decompose(n2.position, n2.quaternion, B2), this.zoomDirectionSet = false, this._updateZoomDirection();
    }
    t2.copy(e2), n2.updateMatrixWorld();
  }
  _raycast(e2) {
    let { scene: t2, useFallbackPlane: n2, fallbackPlane: r2 } = this, i3 = e2.intersectObject(t2)[0] || null;
    if (i3) return i3;
    if (n2) {
      let t3 = r2;
      if (e2.ray.intersectPlane(t3, B2)) return {
        point: B2.clone(),
        distance: e2.ray.origin.distanceTo(B2)
      };
    }
    return null;
  }
  _alignCameraUp(e2, t2 = 1) {
    let { camera: n2, state: r2, pivotPoint: i3, zoomPoint: a3, zoomPointSet: o3 } = this;
    n2.updateMatrixWorld(), V2.set(0, 0, -1).transformDirection(n2.matrixWorld), H2.set(-1, 0, 0).transformDirection(n2.matrixWorld);
    let s3 = x2.mapLinear(1 - Math.abs(V2.dot(e2)), 0, 0.2, 0, 1);
    s3 = x2.clamp(s3, 0, 1), t2 *= s3, un.crossVectors(e2, V2), un.lerp(H2, 1 - t2).normalize(), U2.setFromUnitVectors(H2, un), n2.quaternion.premultiply(U2);
    let c3 = null;
    r2 === 1 || r2 === 2 || r2 === 5 ? c3 = cn.copy(i3) : o3 && (c3 = cn.copy(a3)), c3 && (sn.copy(n2.matrixWorld).invert(), B2.copy(c3).applyMatrix4(sn), n2.updateMatrixWorld(), B2.applyMatrix4(n2.matrixWorld), ln.subVectors(c3, B2), n2.position.add(ln)), n2.updateMatrixWorld();
  }
  _clampRotation(e2) {
    let { camera: t2, minAltitude: n2, maxAltitude: r2, state: i3, pivotPoint: a3, zoomPoint: o3, zoomPointSet: s3 } = this;
    t2.updateMatrixWorld(), V2.set(0, 0, 1).transformDirection(t2.matrixWorld), H2.set(1, 0, 0).transformDirection(t2.matrixWorld);
    let c3;
    e2.dot(V2) > 0.9999999999 ? c3 = 0 : (B2.crossVectors(e2, V2), c3 = Math.sign(B2.dot(H2)) * e2.angleTo(V2));
    let l3;
    if (c3 > r2) l3 = r2;
    else if (c3 < n2) l3 = n2;
    else return;
    V2.copy(e2), U2.setFromAxisAngle(H2, l3), V2.applyQuaternion(U2).normalize(), B2.crossVectors(V2, H2).normalize(), R2.makeBasis(H2, B2, V2), t2.quaternion.setFromRotationMatrix(R2);
    let u4 = null;
    i3 === 1 || i3 === 2 || i3 === 5 ? u4 = cn.copy(a3) : s3 && (u4 = cn.copy(o3)), u4 && (sn.copy(t2.matrixWorld).invert(), B2.copy(u4).applyMatrix4(sn), t2.updateMatrixWorld(), B2.applyMatrix4(t2.matrixWorld), ln.subVectors(u4, B2), t2.position.add(ln)), t2.updateMatrixWorld();
  }
};
var An = /* @__PURE__ */ new S2();
var jn = /* @__PURE__ */ new S2();
var q2 = /* @__PURE__ */ new T2();
var J2 = /* @__PURE__ */ new T2();
var Y2 = /* @__PURE__ */ new T2();
var X2 = /* @__PURE__ */ new T2();
var Mn = /* @__PURE__ */ new T2();
var Nn = /* @__PURE__ */ new T2();
var Z2 = /* @__PURE__ */ new C2();
var Pn = /* @__PURE__ */ new C2();
var Fn = /* @__PURE__ */ new T2();
var In = /* @__PURE__ */ new T2();
var Q2 = /* @__PURE__ */ new le2();
var Ln = /* @__PURE__ */ new Je();
var Rn = /* @__PURE__ */ new w2();
var zn = {};
var Bn = 2550;
var Vn = class extends kn {
  get ellipsoidFrame() {
    return this.ellipsoidGroup.matrixWorld;
  }
  get ellipsoidFrameInverse() {
    let { ellipsoidGroup: e2, ellipsoidFrame: t2, _ellipsoidFrameInverse: n2 } = this;
    return e2.matrixWorldInverse ? e2.matrixWorldInverse : n2.copy(t2).invert();
  }
  constructor(e2 = null, t2 = null, n2 = null) {
    super(e2, t2, n2), this.isGlobeControls = true, this._dragMode = 0, this._rotationMode = 0, this.maxZoom = 0.01, this._dragBaselineMatrix = new S2(), this._dragBaselineRotation = new C2(), this._dragBaselineSet = false, this.nearMargin = 0.25, this.farMargin = 0, this.useFallbackPlane = false, this.autoAdjustCameraRotation = false, this.globeInertia = new C2(), this.globeInertiaFactor = 0, this.ellipsoid = Ye.clone(), this.ellipsoidGroup = new y2(), this._ellipsoidFrameInverse = new S2();
  }
  setEllipsoid(e2, t2) {
    this.ellipsoid = e2 || Ye.clone(), this.ellipsoidGroup = t2 || new y2();
  }
  getPivotPoint(e2) {
    let { camera: t2, ellipsoidFrame: n2, ellipsoidFrameInverse: r2, ellipsoid: i3 } = this;
    return X2.set(0, 0, -1).transformDirection(t2.matrixWorld), Q2.origin.copy(t2.position), Q2.direction.copy(X2), Q2.applyMatrix4(r2), i3.closestPointToRayEstimate(Q2, J2).applyMatrix4(n2), (super.getPivotPoint(e2) === null || q2.subVectors(e2, Q2.origin).dot(Q2.direction) > q2.subVectors(J2, Q2.origin).dot(Q2.direction)) && e2.copy(J2), e2;
  }
  getVectorToCenter(e2) {
    let { ellipsoidFrame: t2, camera: n2 } = this;
    return e2.setFromMatrixPosition(t2).sub(n2.position);
  }
  getDistanceToCenter() {
    return this.getVectorToCenter(J2).length();
  }
  getUpDirection(e2, t2) {
    let { ellipsoidFrame: n2, ellipsoidFrameInverse: r2, ellipsoid: i3 } = this;
    J2.copy(e2).applyMatrix4(r2), i3.getPositionToNormal(J2, t2), t2.transformDirection(n2);
  }
  getCameraUpDirection(e2) {
    let { ellipsoidFrame: t2, ellipsoidFrameInverse: n2, ellipsoid: r2, camera: i3 } = this;
    i3.isOrthographicCamera ? (this._getVirtualOrthoCameraPosition(J2), J2.applyMatrix4(n2), r2.getPositionToNormal(J2, e2), e2.transformDirection(t2)) : this.getUpDirection(i3.position, e2);
  }
  update(e2 = Math.min(this._getDeltaTime(), 64 / 1e3)) {
    if (!this.enabled || !this.camera || e2 === 0) return;
    let { camera: t2, pivotMesh: n2 } = this;
    this._isNearControls() ? this.scaleZoomOrientationAtEdges = this.zoomDelta < 0 : (this.state !== 0 && this._dragMode !== 1 && this._rotationMode !== 1 && (n2.visible = false), this.scaleZoomOrientationAtEdges = false);
    let r2 = this.needsUpdate || this._inertiaNeedsUpdate();
    super.update(e2), this.adjustCamera(t2), r2 && (this._isNearControls() || this.state === 5) && (this.getCameraUpDirection(Nn), this._alignCameraUp(Nn, 1), this.getCameraUpDirection(Nn), this._clampRotation(Nn));
  }
  adjustCamera(e2) {
    super.adjustCamera(e2);
    let { ellipsoidFrame: t2, ellipsoidFrameInverse: n2, ellipsoid: r2, nearMargin: i3, farMargin: a3 } = this, o3 = this._getMaxWorldRadius();
    if (e2.isPerspectiveCamera) {
      let s3 = J2.setFromMatrixPosition(t2).sub(e2.position).length(), c3 = i3 * o3, l3 = x2.clamp((s3 - o3) / c3, 0, 1), u4 = x2.lerp(1, 1e3, l3);
      e2.near = Math.max(u4, s3 - o3 - c3), q2.copy(e2.position).applyMatrix4(n2), r2.getPositionToCartographic(q2, zn);
      let d5 = Math.max(r2.getPositionElevation(q2), Bn);
      e2.far = r2.calculateHorizonDistance(zn.lat, d5) + 0.1 + o3 * a3, e2.updateProjectionMatrix();
    } else {
      this._getVirtualOrthoCameraPosition(e2.position, e2), e2.updateMatrixWorld(), An.copy(e2.matrixWorld).invert(), J2.setFromMatrixPosition(t2).applyMatrix4(An);
      let n3 = -J2.z;
      e2.near = n3 - o3 * (1 + i3), e2.far = n3 + 0.1 + o3 * a3, e2.position.addScaledVector(X2, e2.near), e2.far -= e2.near, e2.near = 0, e2.updateProjectionMatrix(), e2.updateMatrixWorld();
    }
  }
  setState(...e2) {
    super.setState(...e2), this._dragMode = 0, this._rotationMode = 0, this._dragBaselineSet = false;
  }
  _updateInertia(e2) {
    super._updateInertia(e2);
    let { globeInertia: t2, enableDamping: n2, dampingFactor: r2, camera: i3, cameraRadius: a3, minDistance: o3, inertiaTargetDistance: s3, ellipsoidFrame: c3 } = this;
    if (!this.enableDamping || this.inertiaStableFrames > 1) {
      this.globeInertiaFactor = 0, this.globeInertia.identity();
      return;
    }
    let l3 = 2 ** (-e2 / r2), u4 = Math.max(i3.near, a3, o3, s3), d5 = 2 / (2 * 1e3) * 0.25;
    if (Y2.setFromMatrixPosition(c3), this.globeInertiaFactor !== 0) {
      L3(Q2, J2.set(0, 0, -1), i3), Q2.applyMatrix4(i3.matrixWorldInverse), Q2.direction.normalize(), Q2.recast(-Q2.direction.dot(Q2.origin)).at(u4 / Q2.direction.z, J2), J2.applyMatrix4(i3.matrixWorld), L3(Q2, q2.set(d5, d5, -1), i3), Q2.applyMatrix4(i3.matrixWorldInverse), Q2.direction.normalize(), Q2.recast(-Q2.direction.dot(Q2.origin)).at(u4 / Q2.direction.z, q2), q2.applyMatrix4(i3.matrixWorld), J2.sub(Y2).normalize(), q2.sub(Y2).normalize(), this.globeInertiaFactor *= l3;
      let r3 = J2.angleTo(q2) / e2;
      (2 * Math.acos(t2.w) * this.globeInertiaFactor < r3 || !n2) && (this.globeInertiaFactor = 0, t2.identity());
    }
    this.globeInertiaFactor !== 0 && (t2.w === 1 && (t2.x !== 0 || t2.y !== 0 || t2.z !== 0) && (t2.w = Math.min(t2.w, 0.999999999)), Y2.setFromMatrixPosition(c3), Z2.identity().slerp(t2, this.globeInertiaFactor * e2), nn(Y2, Z2, jn), i3.matrixWorld.premultiply(jn), i3.matrixWorld.decompose(i3.position, i3.quaternion, J2));
  }
  _inertiaNeedsUpdate() {
    return super._inertiaNeedsUpdate() || this.globeInertiaFactor !== 0;
  }
  _getFlightSpeedScale() {
    let e2 = this.getDistanceToCenter() - this._getMaxWorldRadius();
    return 2 * Math.max(e2, 1e3);
  }
  _updateFlight(e2) {
    let { camera: t2 } = this, n2 = super._updateFlight(e2);
    if (n2) {
      this._dragBaselineSet = false;
      let e3 = this._getMaxPerspectiveDistance(), n3 = this.getDistanceToCenter();
      if (n3 > e3 && (this.getVectorToCenter(J2).normalize(), t2.position.addScaledVector(J2, n3 - e3), t2.updateMatrixWorld()), !this._isNearControls()) {
        let t3 = x2.clamp(x2.mapLinear(this.getDistanceToCenter(), this._getPerspectiveTransitionDistance(), e3, 0, 1), 0, 1);
        this._tiltTowardsCenter(0.02 * t3), this._alignCameraUpToNorth(0.01 * t3);
      }
    }
    return n2;
  }
  _updatePosition(e2) {
    if (this.state === 1) {
      this._dragMode === 0 && (this._dragMode = this._isNearControls() ? 1 : -1);
      let { raycaster: t2, camera: n2, pivotPoint: r2, pointerTracker: i3, domElement: a3, ellipsoidFrame: o3, ellipsoidFrameInverse: s3 } = this, c3 = q2, l3 = Mn;
      this._dragBaselineSet || (this._dragBaselineSet = (this._dragBaselineMatrix.copy(n2.matrixWorld), this._dragBaselineRotation.identity(), true)), i3.getCenterPoint(Rn), rn(Rn, a3, Rn), An.copy(n2.matrixWorld), n2.matrixWorld.copy(this._dragBaselineMatrix), L3(t2, Rn, n2), n2.matrixWorld.copy(An), t2.ray.applyMatrix4(s3);
      let u4 = J2.copy(r2).applyMatrix4(s3).length();
      if (Ln.radius.setScalar(u4), !Ln.intersectRay(t2.ray, J2)) {
        let { origin: e3, direction: n3 } = t2.ray, r3 = c3.copy(e3).normalize(), i4 = l3.copy(n3).addScaledVector(r3, -r3.dot(n3)).normalize(), a4 = e3.length(), o4 = u4 * Math.sqrt(Math.max(1 - (u4 / a4) ** 2, 0));
        J2.copy(r3).multiplyScalar(u4 * u4 / a4).addScaledVector(i4, o4);
      }
      J2.applyMatrix4(o3), Y2.setFromMatrixPosition(o3), c3.subVectors(r2, Y2).normalize(), l3.subVectors(J2, Y2).normalize(), Z2.setFromUnitVectors(l3, c3), Pn.copy(this._dragBaselineRotation).invert().premultiply(Z2), this._dragBaselineRotation.copy(Z2), nn(Y2, Z2, jn), n2.matrixWorld.copy(this._dragBaselineMatrix).premultiply(jn), n2.matrixWorld.decompose(n2.position, n2.quaternion, J2), i3.getMoveDistance() / e2 < 2 * window.devicePixelRatio ? this.inertiaStableFrames++ : (this.globeInertia.copy(Pn), this.globeInertiaFactor = 1 / e2, this.inertiaStableFrames = 0);
    }
  }
  _updateRotation(...e2) {
    if (this.state === 5) {
      super._updateRotation(...e2);
      return;
    }
    this._rotationMode === 1 || this._isNearControls() ? (this._rotationMode = 1, super._updateRotation(...e2)) : (this.pivotMesh.visible = false, this._rotationMode = -1);
  }
  _updateZoom() {
    let { zoomDelta: e2, zoomSpeed: t2, zoomPoint: n2, camera: r2, maxZoom: i3, state: a3 } = this;
    if (a3 !== 3 && e2 === 0) return;
    this.rotationInertia.set(0, 0), this.dragInertia.set(0, 0, 0), this.globeInertia.identity(), this.globeInertiaFactor = 0, this._dragBaselineSet = false;
    let o3 = x2.clamp(x2.mapLinear(Math.abs(e2), 0, 20, 0, 1), 0, 1);
    if (this._isNearControls() || e2 > 0) {
      if (this._updateZoomDirection(), e2 < 0 && (this.zoomPointSet || this._updateZoomPoint())) {
        X2.set(0, 0, -1).transformDirection(r2.matrixWorld).normalize(), In.copy(this.up).multiplyScalar(-1), this.getUpDirection(n2, Fn);
        let e3 = x2.clamp(x2.mapLinear(-Fn.dot(In), 1, 0.95, 0, 1), 0, 1), t3 = 1 - X2.dot(In), i4 = r2.isOrthographicCamera ? 0.05 : 1, a4 = x2.clamp(o3 * 3, 0, 1), s3 = Math.min(e3 * t3 * i4 * a4, 0.1);
        In.lerpVectors(X2, In, s3).normalize(), Z2.setFromUnitVectors(X2, In), nn(n2, Z2, jn), r2.matrixWorld.premultiply(jn), r2.matrixWorld.decompose(r2.position, r2.quaternion, In), this.zoomDirection.subVectors(n2, r2.position).normalize();
      }
      super._updateZoom();
    } else if (r2.isPerspectiveCamera) {
      let n3 = this._getPerspectiveTransitionDistance(), r3 = this._getMaxPerspectiveDistance(), i4 = x2.mapLinear(this.getDistanceToCenter(), n3, r3, 0, 1);
      this._tiltTowardsCenter(x2.lerp(0, 0.4, i4 * o3)), this._alignCameraUpToNorth(x2.lerp(0, 0.2, i4 * o3));
      let a4 = e2 * (this.getDistanceToCenter() - this._getMaxWorldRadius()) * t2 * On, s3 = Math.max(a4, Math.min(this.getDistanceToCenter() - r3, 0));
      this.getVectorToCenter(J2).normalize(), this.camera.position.addScaledVector(J2, s3), this.camera.updateMatrixWorld(), this.zoomDelta = 0;
    } else {
      let e3 = this._getOrthographicTransitionZoom(), n3 = this._getMinOrthographicZoom(), a4 = x2.mapLinear(r2.zoom, e3, n3, 0, 1);
      this._tiltTowardsCenter(x2.lerp(0, 0.4, a4 * o3)), this._alignCameraUpToNorth(x2.lerp(0, 0.2, a4 * o3));
      let s3 = this.zoomDelta, c3 = 0.95 ** (-t2 * s3 * 0.05), l3 = n3 / r2.zoom, u4 = Math.max(c3, Math.min(l3, 1));
      r2.zoom = Math.min(i3, r2.zoom * u4), r2.updateProjectionMatrix(), this.zoomDelta = 0, this.zoomDirectionSet = false;
    }
  }
  _alignCameraUpToNorth(e2) {
    let { ellipsoidFrame: t2 } = this;
    Nn.set(0, 0, 1).transformDirection(t2), this._alignCameraUp(Nn, e2);
  }
  _tiltTowardsCenter(e2) {
    let { camera: t2, ellipsoidFrame: n2 } = this;
    X2.set(0, 0, -1).transformDirection(t2.matrixWorld).normalize(), J2.setFromMatrixPosition(n2).sub(t2.position).normalize(), J2.lerp(X2, 1 - e2).normalize(), Z2.setFromUnitVectors(X2, J2), t2.quaternion.premultiply(Z2), t2.updateMatrixWorld();
  }
  _getPerspectiveTransitionDistance() {
    let { camera: e2 } = this;
    if (!e2.isPerspectiveCamera) throw Error();
    let t2 = this._getMaxWorldRadius(), n2 = 2 * Math.atan(Math.tan(x2.DEG2RAD * e2.fov * 0.5) * e2.aspect), r2 = t2 / Math.tan(x2.DEG2RAD * e2.fov * 0.5), i3 = t2 / Math.tan(n2 * 0.5);
    return Math.max(r2, i3);
  }
  _getMaxPerspectiveDistance() {
    let { camera: e2 } = this;
    if (!e2.isPerspectiveCamera) throw Error();
    let t2 = this._getMaxWorldRadius(), n2 = 2 * Math.atan(Math.tan(x2.DEG2RAD * e2.fov * 0.5) * e2.aspect), r2 = t2 / Math.tan(x2.DEG2RAD * e2.fov * 0.5), i3 = t2 / Math.tan(n2 * 0.5);
    return 2 * Math.max(r2, i3);
  }
  _getOrthographicTransitionZoom() {
    let { camera: e2 } = this;
    if (!e2.isOrthographicCamera) throw Error();
    let t2 = e2.top - e2.bottom, n2 = e2.right - e2.left, r2 = Math.max(t2, n2), i3 = 2 * this._getMaxWorldRadius();
    return 2 * r2 / i3;
  }
  _getMinOrthographicZoom() {
    let { camera: e2 } = this;
    if (!e2.isOrthographicCamera) throw Error();
    let t2 = e2.top - e2.bottom, n2 = e2.right - e2.left, r2 = Math.min(t2, n2), i3 = 2 * this._getMaxWorldRadius();
    return 0.7 * r2 / i3;
  }
  _getVirtualOrthoCameraPosition(e2, t2 = this.camera) {
    let { ellipsoidFrame: n2, ellipsoidFrameInverse: r2, ellipsoid: i3 } = this;
    if (!t2.isOrthographicCamera) throw Error();
    Q2.origin.copy(t2.position), Q2.direction.set(0, 0, -1).transformDirection(t2.matrixWorld), Q2.applyMatrix4(r2), i3.closestPointToRayEstimate(Q2, q2).applyMatrix4(n2);
    let a3 = t2.top - t2.bottom, o3 = t2.right - t2.left, s3 = Math.max(a3, o3) / t2.zoom;
    X2.set(0, 0, -1).transformDirection(t2.matrixWorld);
    let c3 = q2.sub(t2.position).dot(X2);
    e2.copy(t2.position).addScaledVector(X2, c3 - s3 * 4);
  }
  _isNearControls() {
    let { camera: e2 } = this;
    return e2.isPerspectiveCamera ? this.getDistanceToCenter() < this._getPerspectiveTransitionDistance() : e2.zoom > this._getOrthographicTransitionZoom();
  }
  _raycast(e2) {
    let t2 = super._raycast(e2);
    if (t2 === null) {
      let { ellipsoid: t3, ellipsoidFrame: n2, ellipsoidFrameInverse: r2 } = this;
      Q2.copy(e2.ray).applyMatrix4(r2);
      let i3 = t3.intersectRay(Q2, J2);
      return i3 === null ? null : (i3.applyMatrix4(n2), {
        point: i3.clone(),
        distance: i3.distanceTo(e2.ray.origin)
      });
    } else return t2;
  }
  _getMaxWorldRadius() {
    let { ellipsoid: e2, ellipsoidFrame: t2 } = this;
    return Math.max(...e2.radius) * t2.getMaxScaleOnAxis();
  }
};
var $2 = /* @__PURE__ */ new T2();
var Hn = /* @__PURE__ */ new T2();
var Un = /* @__PURE__ */ new re();
var Wn = /* @__PURE__ */ new T2();
var Gn = /* @__PURE__ */ new T2();
var Kn = /* @__PURE__ */ new T2();
var qn = /* @__PURE__ */ new C2();
var Jn = /* @__PURE__ */ new C2();
var Yn = class extends _2 {
  get animating() {
    return this._alpha !== 0 && this._alpha !== 1;
  }
  get alpha() {
    return this._target === 0 ? 1 - this._alpha : this._alpha;
  }
  get camera() {
    return this._alpha === 0 ? this.perspectiveCamera : this._alpha === 1 ? this.orthographicCamera : this.transitionCamera;
  }
  get mode() {
    return this._target === 0 ? "perspective" : "orthographic";
  }
  set mode(e2) {
    if (e2 === this.mode) return;
    let t2 = this.camera;
    e2 === "perspective" ? (this._target = 0, this._alpha = 0) : (this._target = 1, this._alpha = 1), this.dispatchEvent({
      type: "camera-change",
      camera: this.camera,
      prevCamera: t2
    });
  }
  constructor(e2 = new ie2(), t2 = new re()) {
    super(), this.perspectiveCamera = e2, this.orthographicCamera = t2, this.transitionCamera = new ie2(), this.orthographicPositionalZoom = true, this.orthographicOffset = 50, this.fixedPoint = new T2(), this.duration = 200, this.autoSync = true, this.easeFunction = (e3) => e3, this._target = 0, this._alpha = 0, this._clock = new p();
  }
  toggle() {
    this._target = this._target === 1 ? 0 : 1, this._clock.getDelta(), this.dispatchEvent({ type: "toggle" });
  }
  update(e2 = Math.min(this._clock.getDelta(), 64 / 1e3)) {
    this.autoSync && this.syncCameras();
    let { perspectiveCamera: t2, orthographicCamera: n2, transitionCamera: r2, camera: i3 } = this, a3 = e2 * 1e3;
    if (this._alpha !== this._target) {
      let e3 = Math.sign(this._target - this._alpha) * a3 / this.duration;
      this._alpha = x2.clamp(this._alpha + e3, 0, 1), this.dispatchEvent({
        type: "change",
        alpha: this.alpha
      });
    }
    let o3 = i3, s3 = null;
    this._alpha === 0 ? s3 = t2 : this._alpha === 1 ? s3 = n2 : (s3 = r2, this._updateTransitionCamera()), o3 !== s3 && (s3 === r2 && this.dispatchEvent({ type: "transition-start" }), this.dispatchEvent({
      type: "camera-change",
      camera: s3,
      prevCamera: o3
    }), o3 === r2 && this.dispatchEvent({ type: "transition-end" }));
  }
  syncCameras() {
    let e2 = this._getFromCamera(), { perspectiveCamera: t2, orthographicCamera: n2, transitionCamera: r2, fixedPoint: i3 } = this;
    if ($2.set(0, 0, -1).transformDirection(e2.matrixWorld).normalize(), e2.isPerspectiveCamera) {
      if (this.orthographicPositionalZoom) n2.position.copy(t2.position).addScaledVector($2, -this.orthographicOffset), n2.rotation.copy(t2.rotation), n2.updateMatrixWorld();
      else {
        let e4 = Hn.subVectors(i3, n2.position).dot($2), r4 = Hn.subVectors(i3, t2.position).dot($2);
        Hn.copy(t2.position).addScaledVector($2, r4), n2.rotation.copy(t2.rotation), n2.position.copy(Hn).addScaledVector($2, -e4), n2.updateMatrixWorld();
      }
      let e3 = Math.abs(Hn.subVectors(t2.position, i3).dot($2)), r3 = 2 * Math.tan(x2.DEG2RAD * t2.fov * 0.5) * e3;
      n2.zoom = (n2.top - n2.bottom) / r3, n2.updateProjectionMatrix();
    } else {
      let e3 = Math.abs(Hn.subVectors(n2.position, i3).dot($2)), r3 = (n2.top - n2.bottom) / n2.zoom * 0.5 / Math.tan(x2.DEG2RAD * t2.fov * 0.5);
      t2.rotation.copy(n2.rotation), t2.position.copy(n2.position).addScaledVector($2, e3).addScaledVector($2, -r3), t2.updateMatrixWorld(), this.orthographicPositionalZoom && (n2.position.copy(t2.position).addScaledVector($2, -this.orthographicOffset), n2.updateMatrixWorld());
    }
    r2.position.copy(t2.position), r2.rotation.copy(t2.rotation);
  }
  _getTransitionDirection() {
    return Math.sign(this._target - this._alpha);
  }
  _getToCamera() {
    let e2 = this._getTransitionDirection();
    return e2 === 0 ? this._target === 0 ? this.perspectiveCamera : this.orthographicCamera : e2 > 0 ? this.orthographicCamera : this.perspectiveCamera;
  }
  _getFromCamera() {
    let e2 = this._getTransitionDirection();
    return e2 === 0 ? this._target === 0 ? this.perspectiveCamera : this.orthographicCamera : e2 > 0 ? this.perspectiveCamera : this.orthographicCamera;
  }
  _updateTransitionCamera() {
    let { perspectiveCamera: e2, orthographicCamera: t2, transitionCamera: n2, fixedPoint: r2 } = this, i3 = this.easeFunction(this._alpha);
    $2.set(0, 0, -1).transformDirection(t2.matrixWorld).normalize(), Un.copy(t2), Un.position.addScaledVector($2, t2.near), t2.far -= t2.near, t2.near = 0, $2.set(0, 0, -1).transformDirection(e2.matrixWorld).normalize();
    let a3 = Math.abs(Hn.subVectors(e2.position, r2).dot($2)), o3 = 2 * Math.tan(x2.DEG2RAD * e2.fov * 0.5) * a3, s3 = Jn.slerpQuaternions(e2.quaternion, Un.quaternion, i3), c3 = x2.lerp(e2.fov, 1, i3), l3 = o3 * 0.5 / Math.tan(x2.DEG2RAD * c3 * 0.5), u4 = Kn.copy(Un.position).sub(r2).applyQuaternion(qn.copy(Un.quaternion).invert()), d5 = Gn.copy(e2.position).sub(r2).applyQuaternion(qn.copy(e2.quaternion).invert()), f4 = Wn.lerpVectors(d5, u4, i3);
    f4.z -= Math.abs(f4.z) - l3;
    let p4 = -(d5.z - f4.z), m4 = -(u4.z - f4.z), h5 = x2.lerp(p4 + e2.near, m4 + Un.near, i3), g5 = x2.lerp(p4 + e2.far, m4 + Un.far, i3), _6 = Math.max(g5, 0) - Math.max(h5, 0);
    n2.aspect = e2.aspect, n2.fov = c3, n2.near = Math.max(h5, _6 * 1e-5), n2.far = g5, n2.position.copy(f4).applyQuaternion(s3).add(r2), n2.quaternion.copy(s3), n2.updateProjectionMatrix(), n2.updateMatrixWorld();
  }
};

// node_modules/3d-tiles-renderer/build/plugins-RoDI5SD7.js
var i2 = class {
  constructor(e2 = {}) {
    let { apiToken: t2, autoRefreshToken: n2 = false } = e2;
    this.apiToken = t2, this.autoRefreshToken = n2, this.authURL = null, this._tokenRefreshPromise = null, this._bearerToken = null, this._bearerHostname = null;
  }
  async fetch(e2, t2) {
    await this._tokenRefreshPromise;
    let n2 = { ...t2 }, r2 = this._bearerHostname !== null && new URL(e2).host === this._bearerHostname;
    r2 && (n2.headers = {
      ...n2.headers,
      Authorization: this._bearerToken
    });
    let i3 = await fetch(e2, n2);
    return r2 && i3.status >= 400 && i3.status <= 499 && this.autoRefreshToken ? (await this.refreshToken(t2), n2.headers.Authorization = this._bearerToken, fetch(e2, n2)) : i3;
  }
  refreshToken(e2) {
    if (this._tokenRefreshPromise === null) {
      let t2 = new URL(this.authURL);
      t2.searchParams.set("access_token", this.apiToken), this._tokenRefreshPromise = fetch(t2, e2).then((e3) => {
        if (!e3.ok) throw Error(`CesiumIonAuthPlugin: Failed to load data with error code ${e3.status}`);
        return e3.json();
      }).then((e3) => (e3.accessToken && e3.url && (this._bearerToken = `Bearer ${e3.accessToken}`, this._bearerHostname = new URL(e3.url).host), this._tokenRefreshPromise = null, e3));
    }
    return this._tokenRefreshPromise;
  }
};
var a2 = "https://tile.googleapis.com/v1/createSession";
var o2 = class {
  get isMapTilesSession() {
    return this.authURL === a2;
  }
  constructor(e2 = {}) {
    let { apiToken: t2, sessionOptions: n2 = null, autoRefreshToken: r2 = false } = e2;
    this.apiToken = t2, this.autoRefreshToken = r2, this.authURL = a2, this.sessionToken = null, this.sessionOptions = n2, this._tokenRefreshPromise = null, this._authHostname = null;
  }
  async fetch(e2, t2) {
    this.sessionToken === null && this.isMapTilesSession && this.refreshToken(t2), await this._tokenRefreshPromise, this._authHostname === null && (this._authHostname = new URL(this.authURL).host);
    let n2 = new URL(e2), r2 = n2.host === this._authHostname;
    r2 && (n2.searchParams.set("key", this.apiToken), this.sessionToken && n2.searchParams.set("session", this.sessionToken));
    let i3 = await fetch(n2, t2);
    return r2 && i3.status >= 400 && i3.status <= 499 && this.autoRefreshToken && (await this.refreshToken(t2), this.sessionToken && n2.searchParams.set("session", this.sessionToken), i3 = await fetch(n2, t2)), this.sessionToken === null && !this.isMapTilesSession ? i3.json().then((e3) => (this.sessionToken = s2(e3), e3)) : i3;
  }
  refreshToken(e2) {
    if (this._tokenRefreshPromise === null) {
      let t2 = new URL(this.authURL);
      t2.searchParams.set("key", this.apiToken);
      let n2 = { ...e2 };
      this.isMapTilesSession && (n2.method = "POST", n2.body = JSON.stringify(this.sessionOptions), n2.headers = n2.headers || {}, n2.headers = {
        ...n2.headers,
        "Content-Type": "application/json"
      }), this._tokenRefreshPromise = fetch(t2, n2).then((e3) => {
        if (!e3.ok) throw Error(`GoogleCloudAuth: Failed to load data with error code ${e3.status}`);
        return e3.json();
      }).then((e3) => (this.sessionToken = s2(e3), this._tokenRefreshPromise = null, e3));
    }
    return this._tokenRefreshPromise;
  }
};
function s2(e2) {
  if ("session" in e2) return e2.session;
  {
    let t2 = null, n2 = e2.root;
    return F(n2, (e3) => {
      if (e3.content && e3.content.uri) {
        let [, n3] = e3.content.uri.split("?");
        return t2 = new URLSearchParams(n3).get("session"), true;
      }
      return false;
    }), t2;
  }
}
var c2 = class {
  constructor() {
    this.creditsCount = {};
  }
  _adjustAttributions(e2, t2) {
    let n2 = this.creditsCount, r2 = e2.split(/;/g);
    for (let e3 = 0, i3 = r2.length; e3 < i3; e3++) {
      let i4 = r2[e3];
      i4 in n2 || (n2[i4] = 0), n2[i4] += t2 ? 1 : -1, n2[i4] <= 0 && delete n2[i4];
    }
  }
  addAttributions(e2) {
    this._adjustAttributions(e2, true);
  }
  removeAttributions(e2) {
    this._adjustAttributions(e2, false);
  }
  toString() {
    return Object.entries(this.creditsCount).sort((e2, t2) => {
      let n2 = e2[1];
      return t2[1] - n2;
    }).map((e2) => e2[0]).join("; ");
  }
};
var l2 = "https://tile.googleapis.com/v1/3dtiles/root.json";
var u2 = class {
  constructor({ apiToken: e2, sessionOptions: t2 = null, autoRefreshToken: n2 = false, logoUrl: r2 = null, useRecommendedSettings: i3 = true }) {
    this.name = "GOOGLE_CLOUD_AUTH_PLUGIN", this.apiToken = e2, this.useRecommendedSettings = i3, this.logoUrl = r2, this.auth = new o2({
      apiToken: e2,
      autoRefreshToken: n2,
      sessionOptions: t2
    }), this.tiles = null, this._visibilityChangeCallback = null, this._attributionsManager = new c2(), this._logoAttribution = {
      value: "",
      type: "image",
      collapsible: false
    }, this._attribution = {
      value: "",
      type: "string",
      collapsible: true
    };
  }
  init(e2) {
    let { useRecommendedSettings: t2, auth: n2 } = this;
    e2.resetFailedTiles(), e2.rootURL ?? (e2.rootURL = l2), n2.sessionOptions || (n2.authURL = e2.rootURL), t2 && !n2.isMapTilesSession && (e2.errorTarget = 20), this.tiles = e2, this._visibilityChangeCallback = ({ tile: e3, visible: t3 }) => {
      let n3 = e3.engineData.metadata?.asset?.copyright || "";
      t3 ? this._attributionsManager.addAttributions(n3) : this._attributionsManager.removeAttributions(n3);
    }, e2.addEventListener("tile-visibility-change", this._visibilityChangeCallback);
  }
  getAttributions(e2) {
    this.tiles.visibleTiles.size > 0 && (this.logoUrl && (this._logoAttribution.value = this.logoUrl, e2.push(this._logoAttribution)), this._attribution.value = this._attributionsManager.toString(), e2.push(this._attribution));
  }
  dispose() {
    this.tiles.removeEventListener("tile-visibility-change", this._visibilityChangeCallback);
  }
  async fetchData(e2, t2) {
    return this.auth.fetch(e2, t2);
  }
};
function f2(e2) {
  return e2.implicitTilingData.root.implicitTiling.subdivisionScheme === "OCTREE";
}
function p2(e2) {
  return f2(e2) ? 8 : 4;
}
function m2(e2, t2) {
  if (!e2) return [
    0,
    0,
    0
  ];
  let n2 = e2.implicitTilingData.x, r2 = e2.implicitTilingData.y, i3 = e2.implicitTilingData.z;
  return [
    2 * n2 + t2 % 2,
    2 * r2 + Math.floor(t2 / 2) % 2,
    f2(e2) ? 2 * i3 + Math.floor(t2 / 4) % 2 : 0
  ];
}
var h2 = class {
  constructor(e2, t2) {
    this.parent = e2, this.children = [], this.geometricError = 0, this.boundingVolume = null;
    let [n2, r2, i3] = m2(e2, t2);
    this.implicitTilingData = {
      level: e2.implicitTilingData.level + 1,
      root: e2.implicitTilingData.root,
      subtreeIdx: t2,
      x: n2,
      y: r2,
      z: i3
    };
  }
  static clone(e2) {
    return {
      parent: e2.parent,
      children: [],
      geometricError: e2.geometricError,
      boundingVolume: e2.boundingVolume,
      implicitTilingData: { ...e2.implicitTilingData }
    };
  }
};
var g3 = class extends X {
  constructor(e2) {
    super(), this.tile = e2, this.rootTile = e2.implicitTilingData.root, this.workingPath = null;
  }
  parseBuffer(e2) {
    let r2 = new DataView(e2), i3 = 0, a3 = q(r2);
    console.assert(a3 === "subt", 'SUBTREELoader: The magic bytes equal "subt".'), i3 += 4;
    let o3 = r2.getUint32(i3, true);
    console.assert(o3 === 1, 'SUBTREELoader: The version listed in the header is "1".'), i3 += 4;
    let s3 = r2.getUint32(i3, true);
    i3 += 8;
    let c3 = r2.getUint32(i3, true);
    i3 += 8;
    let l3 = JSON.parse(J(new Uint8Array(e2, i3, s3)));
    return i3 += s3, {
      version: o3,
      subtreeJson: l3,
      subtreeByte: e2.slice(i3, i3 + c3)
    };
  }
  async parse(e2) {
    let t2 = this.parseBuffer(e2), n2 = t2.subtreeJson;
    n2.contentAvailabilityHeaders = [].concat(n2.contentAvailability);
    let r2 = this.preprocessBuffers(n2.buffers), i3 = this.preprocessBufferViews(n2.bufferViews, r2);
    this.markActiveBufferViews(n2, i3);
    let a3 = await this.requestActiveBuffers(r2, t2.subtreeByte), o3 = this.parseActiveBufferViews(i3, a3);
    this.parseAvailability(t2, n2, o3), this.expandSubtree(this.tile, t2);
  }
  markActiveBufferViews(e2, t2) {
    let n2, r2 = e2.tileAvailability;
    isNaN(r2.bitstream) ? isNaN(r2.bufferView) || (n2 = t2[r2.bufferView]) : n2 = t2[r2.bitstream], n2 && (n2.isActive = true, n2.bufferHeader.isActive = true);
    let i3 = e2.contentAvailabilityHeaders;
    for (let e3 = 0; e3 < i3.length; e3++) n2 = void 0, isNaN(i3[e3].bitstream) ? isNaN(i3[e3].bufferView) || (n2 = t2[i3[e3].bufferView]) : n2 = t2[i3[e3].bitstream], n2 && (n2.isActive = true, n2.bufferHeader.isActive = true);
    n2 = void 0;
    let a3 = e2.childSubtreeAvailability;
    isNaN(a3.bitstream) ? isNaN(a3.bufferView) || (n2 = t2[a3.bufferView]) : n2 = t2[a3.bitstream], n2 && (n2.isActive = true, n2.bufferHeader.isActive = true);
  }
  async requestActiveBuffers(e2, t2) {
    let n2 = [];
    for (let r3 = 0; r3 < e2.length; r3++) {
      let i4 = e2[r3];
      if (!i4.isActive) n2.push(Promise.resolve());
      else if (i4.isExternal) {
        let e3 = this.parseImplicitURIBuffer(this.tile, this.rootTile.implicitTiling.subtrees.uri, i4.uri), t3 = fetch(e3, this.fetchOptions).then((e4) => {
          if (!e4.ok) throw Error(`SUBTREELoader: Failed to load external buffer from ${i4.uri} with error code ${e4.status}.`);
          return e4.arrayBuffer();
        }).then((e4) => new Uint8Array(e4));
        n2.push(t3);
      } else n2.push(Promise.resolve(new Uint8Array(t2)));
    }
    let r2 = await Promise.all(n2), i3 = {};
    for (let e3 = 0; e3 < r2.length; e3++) {
      let t3 = r2[e3];
      t3 && (i3[e3] = t3);
    }
    return i3;
  }
  parseActiveBufferViews(e2, t2) {
    let n2 = {};
    for (let r2 = 0; r2 < e2.length; r2++) {
      let i3 = e2[r2];
      if (!i3.isActive) continue;
      let a3 = i3.byteOffset, o3 = a3 + i3.byteLength;
      n2[r2] = t2[i3.buffer].slice(a3, o3);
    }
    return n2;
  }
  preprocessBuffers(e2 = []) {
    for (let t2 = 0; t2 < e2.length; t2++) {
      let n2 = e2[t2];
      n2.isActive = false, n2.isExternal = !!n2.uri;
    }
    return e2;
  }
  preprocessBufferViews(e2 = [], t2) {
    for (let n2 = 0; n2 < e2.length; n2++) {
      let r2 = e2[n2];
      r2.bufferHeader = t2[r2.buffer], r2.isActive = false, r2.isExternal = r2.bufferHeader.isExternal;
    }
    return e2;
  }
  parseAvailability(e2, t2, n2) {
    let r2 = p2(this.rootTile), i3 = this.rootTile.implicitTiling.subtreeLevels, a3 = (r2 ** +i3 - 1) / (r2 - 1), o3 = r2 ** +i3;
    e2._tileAvailability = this.parseAvailabilityBitstream(t2.tileAvailability, n2, a3), e2._contentAvailabilityBitstreams = [];
    for (let r3 = 0; r3 < t2.contentAvailabilityHeaders.length; r3++) {
      let i4 = this.parseAvailabilityBitstream(t2.contentAvailabilityHeaders[r3], n2, a3);
      e2._contentAvailabilityBitstreams.push(i4);
    }
    e2._childSubtreeAvailability = this.parseAvailabilityBitstream(t2.childSubtreeAvailability, n2, o3);
  }
  parseAvailabilityBitstream(e2, t2, n2) {
    if (!isNaN(e2.constant)) return {
      constant: !!e2.constant,
      lengthBits: n2
    };
    let r2;
    return isNaN(e2.bitstream) ? isNaN(e2.bufferView) || (r2 = t2[e2.bufferView]) : r2 = t2[e2.bitstream], {
      bitstream: r2,
      lengthBits: n2
    };
  }
  expandSubtree(e2, t2) {
    let n2 = h2.clone(e2);
    for (let r3 = 0; t2 && r3 < t2._contentAvailabilityBitstreams.length; r3++) if (t2 && this.getBit(t2._contentAvailabilityBitstreams[r3], 0)) {
      n2.content = { uri: this.parseImplicitURI(e2, this.rootTile.content.uri) };
      break;
    }
    e2.children.push(n2);
    let r2 = this.transcodeSubtreeTiles(n2, t2), i3 = this.listChildSubtrees(t2, r2);
    for (let e3 = 0; e3 < i3.length; e3++) {
      let t3 = i3[e3], n3 = t3.tile, r3 = this.deriveChildTile(null, n3, null, t3.childMortonIndex);
      r3.content = { uri: this.parseImplicitURI(r3, this.rootTile.implicitTiling.subtrees.uri) }, n3.children.push(r3);
    }
  }
  transcodeSubtreeTiles(e2, t2) {
    let n2 = [e2], r2 = [];
    for (let e3 = 1; e3 < this.rootTile.implicitTiling.subtreeLevels; e3++) {
      let i3 = p2(this.rootTile), a3 = (i3 ** +e3 - 1) / (i3 - 1), o3 = i3 * n2.length;
      for (let e4 = 0; e4 < o3; e4++) {
        let o4 = a3 + e4, s3 = e4 >> Math.log2(i3), c3 = n2[s3];
        if (!this.getBit(t2._tileAvailability, o4)) {
          r2.push(void 0);
          continue;
        }
        let l3 = this.deriveChildTile(t2, c3, o4, e4);
        c3.children.push(l3), r2.push(l3);
      }
      n2 = r2, r2 = [];
    }
    return n2;
  }
  deriveChildTile(e2, t2, n2, r2) {
    let i3 = new h2(t2, r2);
    i3.boundingVolume = this.getTileBoundingVolume(i3), i3.geometricError = this.getGeometricError(i3);
    for (let t3 = 0; e2 && t3 < e2._contentAvailabilityBitstreams.length; t3++) if (e2 && this.getBit(e2._contentAvailabilityBitstreams[t3], n2)) {
      i3.content = { uri: this.parseImplicitURI(i3, this.rootTile.content.uri) };
      break;
    }
    return i3;
  }
  getBit(e2, t2) {
    if (t2 < 0 || t2 >= e2.lengthBits) throw Error("Bit index out of bounds.");
    if (e2.constant !== void 0) return e2.constant;
    let n2 = t2 >> 3, r2 = t2 % 8;
    return (new Uint8Array(e2.bitstream)[n2] >> r2 & 1) == 1;
  }
  getTileBoundingVolume(e2) {
    let t2 = {};
    if (this.rootTile.boundingVolume.region) {
      let n2 = [...this.rootTile.boundingVolume.region], r2 = n2[0], i3 = n2[2], a3 = n2[1], o3 = n2[3], s3 = (i3 - r2) / 2 ** e2.implicitTilingData.level, c3 = (o3 - a3) / 2 ** e2.implicitTilingData.level;
      n2[0] = r2 + s3 * e2.implicitTilingData.x, n2[2] = r2 + s3 * (e2.implicitTilingData.x + 1), n2[1] = a3 + c3 * e2.implicitTilingData.y, n2[3] = a3 + c3 * (e2.implicitTilingData.y + 1);
      for (let e3 = 0; e3 < 4; e3++) {
        let t3 = n2[e3];
        t3 < -Math.PI ? n2[e3] += 2 * Math.PI : t3 > Math.PI && (n2[e3] -= 2 * Math.PI);
      }
      if (f2(e2)) {
        let t3 = n2[4], r3 = (n2[5] - t3) / 2 ** e2.implicitTilingData.level;
        n2[4] = t3 + r3 * e2.implicitTilingData.z, n2[5] = t3 + r3 * (e2.implicitTilingData.z + 1);
      }
      t2.region = n2;
    }
    if (this.rootTile.boundingVolume.box) {
      let n2 = [...this.rootTile.boundingVolume.box], r2 = 2 ** e2.implicitTilingData.level - 1, i3 = 2 ** -e2.implicitTilingData.level, a3 = f2(e2) ? 3 : 2;
      for (let t3 = 0; t3 < a3; t3++) {
        n2[3 + t3 * 3 + 0] *= i3, n2[3 + t3 * 3 + 1] *= i3, n2[3 + t3 * 3 + 2] *= i3;
        let a4 = n2[3 + t3 * 3 + 0], o3 = n2[3 + t3 * 3 + 1], s3 = n2[3 + t3 * 3 + 2], c3 = t3 === 0 ? e2.implicitTilingData.x : t3 === 1 ? e2.implicitTilingData.y : e2.implicitTilingData.z;
        n2[0] += 2 * a4 * (-0.5 * r2 + c3), n2[1] += 2 * o3 * (-0.5 * r2 + c3), n2[2] += 2 * s3 * (-0.5 * r2 + c3);
      }
      t2.box = n2;
    }
    return t2;
  }
  getGeometricError(e2) {
    return this.rootTile.geometricError / 2 ** e2.implicitTilingData.level;
  }
  listChildSubtrees(e2, t2) {
    let n2 = [], r2 = p2(this.rootTile);
    for (let i3 = 0; i3 < t2.length; i3++) {
      let a3 = t2[i3];
      if (a3 !== void 0) for (let t3 = 0; t3 < r2; t3++) {
        let o3 = i3 * r2 + t3;
        this.getBit(e2._childSubtreeAvailability, o3) && n2.push({
          tile: a3,
          childMortonIndex: o3
        });
      }
    }
    return n2;
  }
  parseImplicitURI(e2, t2) {
    return t2 = t2.replace("{level}", e2.implicitTilingData.level), t2 = t2.replace("{x}", e2.implicitTilingData.x), t2 = t2.replace("{y}", e2.implicitTilingData.y), t2 = t2.replace("{z}", e2.implicitTilingData.z), t2;
  }
  parseImplicitURIBuffer(e2, t2, n2) {
    let r2 = this.parseImplicitURI(e2, t2), i3 = new URL(r2, this.workingPath + "/");
    return i3.pathname = i3.pathname.substring(0, i3.pathname.lastIndexOf("/")), new URL(i3.pathname + "/" + n2, this.workingPath + "/").toString();
  }
};
var _3 = class {
  constructor() {
    this.name = "IMPLICIT_TILING_PLUGIN";
  }
  init(e2) {
    this.tiles = e2;
  }
  preprocessNode(e2, t2, n2) {
    e2.implicitTiling ? (e2.internal.hasUnrenderableContent = true, e2.internal.hasRenderableContent = false, e2.implicitTilingData = {
      root: e2,
      subtreeIdx: 0,
      x: 0,
      y: 0,
      z: 0,
      level: 0
    }) : /.subtree$/i.test(e2.content?.uri) && (e2.internal.hasUnrenderableContent = true, e2.internal.hasRenderableContent = false);
  }
  parseTile(e2, t2, n2) {
    if (/^subtree$/i.test(n2)) {
      let n3 = new g3(t2);
      return n3.workingPath = t2.internal.basePath, n3.fetchOptions = this.tiles.fetchOptions, n3.parse(e2);
    }
  }
  preprocessURL(e2, t2) {
    if (t2 && t2.implicitTiling) {
      let e3 = t2.implicitTiling.subtrees.uri.replace("{level}", t2.implicitTilingData.level).replace("{x}", t2.implicitTilingData.x).replace("{y}", t2.implicitTilingData.y).replace("{z}", t2.implicitTilingData.z);
      return new URL(e3, t2.internal.basePath + "/").toString();
    }
    return e2;
  }
  disposeTile(e2) {
    /.subtree$/i.test(e2.content?.uri) && (e2.children.forEach((e3) => {
      this.tiles.processNodeQueue.remove(e3);
    }), e2.children.length = 0);
  }
};
var v3 = class {
  constructor() {
    this.name = "ENFORCE_NONZERO_ERROR", this.priority = -Infinity, this.originalError = /* @__PURE__ */ new Map();
  }
  preprocessNode(e2) {
    if (e2.geometricError === 0) {
      let t2 = e2.parent, n2 = 1;
      for (; t2 !== null; ) {
        if (t2.geometricError !== 0) {
          e2.geometricError = t2.geometricError * 2 ** -n2;
          break;
        }
        t2 = t2.parent, n2++;
      }
    }
  }
};
function y3(e2) {
  return e2 >> 1 ^ -(e2 & 1);
}
var b3 = class extends X {
  constructor(...e2) {
    super(...e2), this.fetchOptions.header = { Accept: "application/vnd.quantized-mesh,application/octet-stream;q=0.9" };
  }
  loadAsync(...e2) {
    let { fetchOptions: t2 } = this;
    return t2.header = t2.header || {}, t2.header.Accept = "application/vnd.quantized-mesh,application/octet-stream;q=0.9", t2.header.Accept += ";extensions=octvertexnormals-watermask-metadata", super.loadAsync(...e2);
  }
  parse(e2) {
    let t2 = 0, n2 = new DataView(e2), r2 = () => {
      let e3 = n2.getFloat64(t2, true);
      return t2 += 8, e3;
    }, i3 = () => {
      let e3 = n2.getFloat32(t2, true);
      return t2 += 4, e3;
    }, a3 = () => {
      let e3 = n2.getUint32(t2, true);
      return t2 += 4, e3;
    }, o3 = () => {
      let e3 = n2.getUint8(t2);
      return t2 += 1, e3;
    }, s3 = (n3, r3) => {
      let i4 = new r3(e2, t2, n3);
      return t2 += n3 * r3.BYTES_PER_ELEMENT, i4;
    }, c3 = {
      center: [
        r2(),
        r2(),
        r2()
      ],
      minHeight: i3(),
      maxHeight: i3(),
      sphereCenter: [
        r2(),
        r2(),
        r2()
      ],
      sphereRadius: r2(),
      horizonOcclusionPoint: [
        r2(),
        r2(),
        r2()
      ]
    }, l3 = a3(), u4 = s3(l3, Uint16Array), d5 = s3(l3, Uint16Array), f4 = s3(l3, Uint16Array), p4 = new Float32Array(l3), m4 = new Float32Array(l3), h5 = new Float32Array(l3), g5 = 0, _6 = 0, v6 = 0, b6 = 32767;
    for (let e3 = 0; e3 < l3; ++e3) g5 += y3(u4[e3]), _6 += y3(d5[e3]), v6 += y3(f4[e3]), p4[e3] = g5 / b6, m4[e3] = _6 / b6, h5[e3] = v6 / b6;
    let S5 = l3 > 65536, C5 = S5 ? Uint32Array : Uint16Array;
    t2 = S5 ? Math.ceil(t2 / 4) * 4 : Math.ceil(t2 / 2) * 2;
    let w5 = s3(a3() * 3, C5), T6 = 0;
    for (var E5 = 0; E5 < w5.length; ++E5) {
      let e3 = w5[E5];
      w5[E5] = T6 - e3, e3 === 0 && ++T6;
    }
    let D6 = (e3, t3) => m4[t3] - m4[e3], O5 = (e3, t3) => -D6(e3, t3), k5 = (e3, t3) => p4[e3] - p4[t3], A6 = (e3, t3) => -k5(e3, t3), j5 = s3(a3(), C5);
    j5.sort(D6);
    let M6 = s3(a3(), C5);
    M6.sort(k5);
    let N5 = s3(a3(), C5);
    N5.sort(O5);
    let P5 = s3(a3(), C5);
    P5.sort(A6);
    let F5 = {
      westIndices: j5,
      southIndices: M6,
      eastIndices: N5,
      northIndices: P5
    }, I5 = {};
    for (; t2 < n2.byteLength; ) {
      let e3 = o3(), t3 = a3();
      if (e3 === 1) {
        let t4 = s3(l3 * 2, Uint8Array), n3 = new Float32Array(l3 * 3);
        for (let e4 = 0; e4 < l3; e4++) {
          let r3 = t4[2 * e4 + 0] / 255 * 2 - 1, i4 = t4[2 * e4 + 1] / 255 * 2 - 1, a4 = 1 - (Math.abs(r3) + Math.abs(i4));
          if (a4 < 0) {
            let e5 = r3;
            r3 = (1 - Math.abs(i4)) * x3(e5), i4 = (1 - Math.abs(e5)) * x3(i4);
          }
          let o4 = Math.sqrt(r3 * r3 + i4 * i4 + a4 * a4);
          n3[3 * e4 + 0] = r3 / o4, n3[3 * e4 + 1] = i4 / o4, n3[3 * e4 + 2] = a4 / o4;
        }
        I5.octvertexnormals = {
          extensionId: e3,
          normals: n3
        };
      } else if (e3 === 2) {
        let n3 = t3 === 1 ? 1 : 256;
        I5.watermask = {
          extensionId: e3,
          mask: s3(n3 * n3, Uint8Array),
          size: n3
        };
      } else if (e3 === 4) {
        let t4 = s3(a3(), Uint8Array), n3 = new TextDecoder().decode(t4);
        I5.metadata = {
          extensionId: e3,
          json: JSON.parse(n3)
        };
      }
    }
    return {
      header: c3,
      indices: w5,
      vertexData: {
        u: p4,
        v: m4,
        height: h5
      },
      edgeIndices: F5,
      extensions: I5
    };
  }
};
function x3(e2) {
  return e2 < 0 ? -1 : 1;
}

// node_modules/3d-tiles-renderer/build/plugins-DXnt62ch.js
import { BatchedMesh as g4, Box2 as _5, Box3 as v5, Box3Helper as y5, BoxGeometry as b5, BufferAttribute as x5, BufferGeometry as S4, CanvasTexture as C4, Color as w4, CustomBlending as T5, DataTexture as E4, DefaultLoadingManager as D5, DoubleSide as O4, EventDispatcher as k4, FileLoader as A5, FloatType as j4, Frustum as M5, GreaterDepth as ee3, Group as te3, LineBasicMaterial as ne3, LineSegments as re3, LinearFilter as ie4, LinearMipMapLinearFilter as ae2, MathUtils as N4, Matrix2 as oe3, Matrix3 as se3, Matrix4 as P4, Mesh as ce3, MeshBasicMaterial as F4, MeshLambertMaterial as le3, MeshStandardMaterial as ue3, NearestFilter as de3, OneFactor as fe2, PlaneGeometry as pe2, Points as me2, PointsMaterial as he2, Quaternion as ge2, REVISION as _e2, RGBAIntegerFormat as ve2, RGFormat as ye2, Ray as be2, Raycaster as xe2, RedFormat as Se2, SRGBColorSpace as Ce2, ShaderMaterial as we2, Source as Te2, Sphere as Ee2, SphereGeometry as De2, Texture as Oe2, TextureUtils as ke2, Triangle as Ae2, UnsignedByteType as je2, Vector2 as I4, Vector3 as L4, Vector4 as Me2, WebGLArrayRenderTarget as Ne2, WebGLRenderTarget as Pe2, WebGLRenderer as Fe2, ZeroFactor as Ie2 } from "three";
import { GLTFLoader as Le2 } from "three/addons/loaders/GLTFLoader.js";
import { FullScreenQuad as Re2 } from "three/addons/postprocessing/Pass.js";
var ze2 = /* @__PURE__ */ new L4();
var Be2 = /* @__PURE__ */ new L4();
function Ve2(e2, t2, n2) {
  let r2 = 1e-5, i3 = n2 + r2, a3 = t2 + r2;
  Math.abs(a3) > Math.PI / 2 && (a3 -= r2), e2.getCartographicToPosition(t2, n2, 0, ze2), e2.getCartographicToPosition(a3, n2, 0, Be2);
  let o3 = ze2.distanceTo(Be2) / r2;
  return e2.getCartographicToPosition(t2, i3, 0, Be2), [ze2.distanceTo(Be2) / r2, o3];
}
var He2 = 1e-5;
var Ue2 = 1.340264;
var We2 = -0.081106;
var Ge2 = 893e-6;
var Ke2 = 3796e-6;
var qe2 = Math.sqrt(3) / 2;
var Je2 = 1e-12;
var Ye2 = 12;
function Xe2(e2, t2, n2) {
  let r2 = Math.asin(qe2 * Math.sin(t2)), i3 = r2 * r2, a3 = i3 * i3 * i3;
  return n2[0] = e2 * Math.cos(r2) / (qe2 * (Ue2 + 3 * We2 * i3 + a3 * (7 * Ge2 + 9 * Ke2 * i3))), n2[1] = r2 * (Ue2 + We2 * i3 + a3 * (Ge2 + Ke2 * i3)), n2;
}
function Ze2(e2, t2, n2) {
  let r2 = t2, i3 = r2 * r2, a3 = i3 * i3 * i3;
  for (let e3 = 0; e3 < Ye2; e3++) {
    let e4 = (r2 * (Ue2 + We2 * i3 + a3 * (Ge2 + Ke2 * i3)) - t2) / (Ue2 + 3 * We2 * i3 + a3 * (7 * Ge2 + 9 * Ke2 * i3));
    if (r2 -= e4, i3 = r2 * r2, a3 = i3 * i3 * i3, Math.abs(e4) < Je2) break;
  }
  return n2[0] = qe2 * e2 * (Ue2 + 3 * We2 * i3 + a3 * (7 * Ge2 + 9 * Ke2 * i3)) / Math.cos(r2), n2[1] = Math.asin(Math.sin(r2) / qe2), n2;
}
var Qe2 = Xe2(Math.PI, 0, [0, 0])[0];
var $e2 = Xe2(0, Math.PI / 2, [0, 0])[1];
var et3 = [0, 0];
var tt2 = [0, 0];
var R5 = class {
  get isMercator() {
    return this.scheme === "EPSG:3857";
  }
  get isCartographic() {
    return this.scheme !== "none";
  }
  constructor(e2 = "EPSG:4326") {
    this.scheme = e2, this.tileCountX = 1, this.tileCountY = 1, this.setScheme(e2);
  }
  setScheme(e2) {
    switch (this.scheme = e2, e2) {
      case "CRS:84":
      case "EPSG:4326":
        this.tileCountX = 2, this.tileCountY = 1;
        break;
      case "EPSG:3857":
        this.tileCountX = 1, this.tileCountY = 1;
        break;
      case "EPSG:8857":
        this.tileCountX = 1, this.tileCountY = 1;
        break;
      case "none":
        this.tileCountX = 1, this.tileCountY = 1;
        break;
      default:
        throw Error(`ProjectionScheme: Unknown projection scheme "${e2}"`);
    }
  }
  getDerivativeAtNormalizedPoint(e2, t2, n2 = [0, 0]) {
    let r2 = Math.max(e2 - He2, 0), i3 = Math.min(e2 + He2, 1), a3 = Math.max(t2 - He2, 0), o3 = Math.min(t2 + He2, 1), s3 = this.fromNormalizedToCartographic(r2, t2, tt2)[0], c3 = this.fromNormalizedToCartographic(i3, t2, tt2)[0];
    n2[0] = Math.abs(c3 - s3) / (i3 - r2);
    let l3 = this.fromNormalizedToCartographic(e2, a3, tt2)[1], u4 = this.fromNormalizedToCartographic(e2, o3, tt2)[1];
    return n2[1] = Math.abs(u4 - l3) / (o3 - a3), n2;
  }
  getBounds() {
    return this.scheme === "none" ? [
      0,
      0,
      1,
      1
    ] : [
      this.fromNormalizedToCartographic(0, 0.5, et3)[0],
      this.fromNormalizedToCartographic(0.5, 0, et3)[1],
      this.fromNormalizedToCartographic(1, 0.5, et3)[0],
      this.fromNormalizedToCartographic(0.5, 1, et3)[1]
    ];
  }
  fromCartographicToNormalized(e2, t2, n2 = [0, 0]) {
    switch (this.scheme) {
      case "none":
        n2[0] = e2, n2[1] = t2;
        break;
      case "EPSG:3857": {
        let r2 = Math.log(Math.tan(Math.PI / 4 + t2 / 2));
        n2[0] = (e2 + Math.PI) / (2 * Math.PI), n2[1] = 1 / 2 + 1 * r2 / (2 * Math.PI);
        break;
      }
      case "EPSG:8857":
        Xe2(e2, t2, n2), n2[0] = N4.mapLinear(n2[0], -Qe2, Qe2, 0, 1), n2[1] = N4.mapLinear(n2[1], -$e2, $e2, 0, 1);
        break;
      default:
        n2[0] = (e2 + Math.PI) / (2 * Math.PI), n2[1] = N4.mapLinear(t2, -Math.PI / 2, Math.PI / 2, 0, 1);
    }
    return n2;
  }
  fromCartographicToNormalizedRange(e2) {
    return [...this.fromCartographicToNormalized(e2[0], e2[1]), ...this.fromCartographicToNormalized(e2[2], e2[3])];
  }
  fromNormalizedToCartographic(e2, t2, n2 = [0, 0]) {
    switch (this.scheme) {
      case "none":
        n2[0] = e2, n2[1] = t2;
        break;
      case "EPSG:3857": {
        let r2 = N4.mapLinear(t2, 0, 1, -1, 1);
        n2[0] = N4.mapLinear(e2, 0, 1, -Math.PI, Math.PI), n2[1] = 2 * Math.atan(Math.exp(r2 * Math.PI)) - Math.PI / 2;
        break;
      }
      case "EPSG:8857":
        Ze2(N4.mapLinear(e2, 0, 1, -Qe2, Qe2), N4.mapLinear(t2, 0, 1, -$e2, $e2), n2);
        break;
      default:
        n2[0] = N4.mapLinear(e2, 0, 1, -Math.PI, Math.PI), n2[1] = N4.mapLinear(t2, 0, 1, -Math.PI / 2, Math.PI / 2);
    }
    return n2;
  }
  fromNormalizedToCartographicRange(e2) {
    return [...this.fromNormalizedToCartographic(e2[0], e2[1]), ...this.fromNormalizedToCartographic(e2[2], e2[3])];
  }
  getProjectedExtents() {
    switch (this.scheme) {
      case "EPSG:3857":
        return [2 * Math.PI, 2 * Math.PI];
      case "EPSG:8857":
        return [2 * Qe2, 2 * $e2];
      case "none":
        return [1, 1];
      default:
        return [2 * Math.PI, Math.PI];
    }
  }
  clampToBounds(e2, t2 = false) {
    let n2 = [...e2], r2;
    r2 = t2 ? [
      0,
      0,
      1,
      1
    ] : this.getBounds();
    let [i3, a3, o3, s3] = r2;
    return n2[0] = N4.clamp(n2[0], i3, o3), n2[2] = N4.clamp(n2[2], i3, o3), n2[1] = N4.clamp(n2[1], a3, s3), n2[3] = N4.clamp(n2[3], a3, s3), n2;
  }
};
var nt2 = [0, 0];
function rt2(e2, t2) {
  let [n2, r2, i3, a3] = e2, [o3, s3, c3, l3] = t2;
  return !(n2 >= c3 || i3 <= o3 || r2 >= l3 || a3 <= s3);
}
var it2 = class {
  get levelCount() {
    return this._levels.length;
  }
  get maxLevel() {
    return this.levelCount - 1;
  }
  get minLevel() {
    let e2 = this._levels;
    for (let t2 = 0; t2 < e2.length; t2++) if (e2[t2] !== null) return t2;
    return -1;
  }
  get contentBounds() {
    return this._contentBounds ?? this.projection.getBounds();
  }
  get aspectRatio() {
    let { pixelWidth: e2, pixelHeight: t2 } = this.getLevel(this.maxLevel);
    return e2 / t2;
  }
  constructor() {
    this.flipY = false, this.pixelOverlap = 0, this._contentBounds = null, this.projection = new R5("none"), this._levels = [];
  }
  setLevel(e2, t2 = {}) {
    let n2 = this._levels;
    for (; n2.length < e2; ) n2.push(null);
    let { tileSplitX: r2 = 2, tileSplitY: i3 = 2 } = t2, { tilePixelWidth: a3 = 256, tilePixelHeight: o3 = 256, tileCountX: s3 = r2 ** e2, tileCountY: c3 = i3 ** e2, tileBounds: l3 = null } = t2, { pixelWidth: u4 = a3 * s3, pixelHeight: d5 = o3 * c3 } = t2;
    n2[e2] = {
      tilePixelWidth: a3,
      tilePixelHeight: o3,
      pixelWidth: u4,
      pixelHeight: d5,
      tileCountX: s3,
      tileCountY: c3,
      tileSplitX: r2,
      tileSplitY: i3,
      tileBounds: l3
    };
  }
  generateLevels(e2, t2, n2, r2 = {}) {
    let { minLevel: i3 = 0, tilePixelWidth: a3 = 256, tilePixelHeight: o3 = 256 } = r2, s3 = e2 - 1, { pixelWidth: c3 = a3 * t2 * 2 ** s3, pixelHeight: l3 = o3 * n2 * 2 ** s3 } = r2;
    for (let t3 = i3; t3 < e2; t3++) {
      let n3 = e2 - t3 - 1, r3 = Math.ceil(c3 * 2 ** -n3), i4 = Math.ceil(l3 * 2 ** -n3), s4 = Math.ceil(r3 / a3), u4 = Math.ceil(i4 / o3);
      this.setLevel(t3, {
        tilePixelWidth: a3,
        tilePixelHeight: o3,
        pixelWidth: r3,
        pixelHeight: i4,
        tileCountX: s4,
        tileCountY: u4
      });
    }
  }
  getLevel(e2) {
    return this._levels[e2];
  }
  setContentBounds(e2, t2, n2, r2) {
    this._contentBounds = [
      e2,
      t2,
      n2,
      r2
    ];
  }
  setProjection(e2) {
    this.projection = e2;
  }
  getTileAtPoint(e2, t2, n2, r2 = false) {
    let { flipY: i3 } = this, { tileCountY: a3, tileBounds: o3, pixelHeight: s3, pixelWidth: c3, tilePixelHeight: l3, tilePixelWidth: u4 } = this.getLevel(n2), d5 = u4 / c3, f4 = l3 / s3;
    if (r2 || ([e2, t2] = this.fromCartographicToNormalized(e2, t2, nt2)), o3) {
      let n3 = this.fromCartographicToNormalizedRange(o3);
      e2 = N4.mapLinear(e2, n3[0], n3[2], 0, 1), t2 = N4.mapLinear(t2, n3[1], n3[3], 0, 1);
    }
    let p4 = Math.floor(e2 / d5), m4 = Math.floor(t2 / f4);
    return i3 && (m4 = a3 - 1 - m4), [p4, m4];
  }
  getTilesInRange(e2, t2, n2, r2, i3, a3 = false) {
    let o3 = [
      e2,
      t2,
      n2,
      r2
    ], s3 = this.getContentBounds(a3), c3 = this.getLevel(i3).tileBounds;
    if (!rt2(o3, s3) || c3 && (a3 && (c3 = this.fromCartographicToNormalizedRange(c3)), !rt2(o3, c3))) return [
      0,
      0,
      -1,
      -1
    ];
    let [l3, u4, d5, f4] = this.clampToContentBounds(o3, a3), p4 = this.getTileAtPoint(l3, u4, i3, a3), m4 = this.getTileAtPoint(d5, f4, i3, a3);
    this.flipY && ([p4[1], m4[1]] = [m4[1], p4[1]]);
    let { tileCountX: h5, tileCountY: g5 } = this.getLevel(i3), [_6, v6] = p4, [y6, b6] = m4;
    return y6 < 0 || b6 < 0 || _6 >= h5 || v6 >= g5 ? [
      0,
      0,
      -1,
      -1
    ] : [
      N4.clamp(_6, 0, h5 - 1),
      N4.clamp(v6, 0, g5 - 1),
      N4.clamp(y6, 0, h5 - 1),
      N4.clamp(b6, 0, g5 - 1)
    ];
  }
  getTileExists(e2, t2, n2) {
    let r2 = this.getTileBounds(e2, t2, n2), [i3, a3, o3, s3] = r2;
    return !(i3 >= o3 || a3 >= s3) && rt2(r2, this.contentBounds);
  }
  getContentBounds(e2 = false) {
    return e2 ? this.fromCartographicToNormalizedRange(this.contentBounds) : [...this.contentBounds];
  }
  getTileContentUVBounds(e2, t2, n2) {
    let [r2, i3, a3, o3] = this.getTileBounds(e2, t2, n2, true, true), [s3, c3, l3, u4] = this.getTileBounds(e2, t2, n2, true, false);
    return [
      N4.mapLinear(r2, s3, l3, 0, 1),
      N4.mapLinear(i3, c3, u4, 0, 1),
      N4.mapLinear(a3, s3, l3, 0, 1),
      N4.mapLinear(o3, c3, u4, 0, 1)
    ];
  }
  getTileBounds(e2, t2, n2, r2 = false, i3 = true) {
    let { flipY: a3, pixelOverlap: o3 } = this, { tilePixelWidth: s3, tilePixelHeight: c3, pixelWidth: l3, pixelHeight: u4, tileBounds: d5 } = this.getLevel(n2), f4 = s3 * e2 - o3, p4 = c3 * t2 - o3, m4 = f4 + s3 + o3 * 2, h5 = p4 + c3 + o3 * 2;
    if (f4 = Math.max(f4, 0), p4 = Math.max(p4, 0), m4 = Math.min(m4, l3), h5 = Math.min(h5, u4), f4 /= l3, m4 /= l3, p4 /= u4, h5 /= u4, a3) {
      let e3 = (h5 - p4) / 2, t3 = 1 - (p4 + h5) / 2;
      p4 = t3 - e3, h5 = t3 + e3;
    }
    let g5 = [
      f4,
      p4,
      m4,
      h5
    ];
    if (d5) {
      let e3 = this.fromCartographicToNormalizedRange(d5);
      g5[0] = N4.mapLinear(g5[0], 0, 1, e3[0], e3[2]), g5[2] = N4.mapLinear(g5[2], 0, 1, e3[0], e3[2]), g5[1] = N4.mapLinear(g5[1], 0, 1, e3[1], e3[3]), g5[3] = N4.mapLinear(g5[3], 0, 1, e3[1], e3[3]);
    }
    return i3 && (g5 = this.clampToBounds(g5, true)), r2 || (g5 = this.fromNormalizedToCartographicRange(g5)), g5;
  }
  fromCartographicToNormalized(e2, t2, n2) {
    return this.projection.fromCartographicToNormalized(e2, t2, n2);
  }
  fromCartographicToNormalizedRange(e2) {
    return this.projection.fromCartographicToNormalizedRange(e2);
  }
  fromNormalizedToCartographic(e2, t2, n2) {
    return this.projection.fromNormalizedToCartographic(e2, t2, n2);
  }
  fromNormalizedToCartographicRange(e2) {
    return this.projection.fromNormalizedToCartographicRange(e2);
  }
  clampToContentBounds(e2, t2 = false) {
    let n2 = [...e2], [r2, i3, a3, o3] = this.getContentBounds(t2);
    return n2[0] = N4.clamp(n2[0], r2, a3), n2[1] = N4.clamp(n2[1], i3, o3), n2[2] = N4.clamp(n2[2], r2, a3), n2[3] = N4.clamp(n2[3], i3, o3), n2;
  }
  clampToBounds(e2, t2 = false) {
    return this.projection.clampToBounds(e2, t2);
  }
};
var at2 = [0, 0];
var ot2 = class {
  constructor(e2 = new R5()) {
    this.isProjectedSurface = true, this.projection = e2, this.scale = new I4(1, 1), this.offset = new I4(0, 0);
  }
  getCartographicToPosition(e2, t2, n2, r2) {
    let { projection: i3 } = this;
    if (!i3.isCartographic) throw Error("ProjectedSurface: The projection is not cartographic.");
    let [a3, o3] = i3.fromCartographicToNormalized(t2, e2, at2);
    return this.getNormalizedToPosition(a3, o3, n2, r2);
  }
  getPositionToCartographic(e2, t2) {
    let { projection: n2, scale: r2, offset: i3 } = this;
    if (!n2.isCartographic) throw Error("ProjectedSurface: The projection is not cartographic.");
    let a3 = (e2.x - i3.x) / r2.x, o3 = (e2.y - i3.y) / r2.y, [s3, c3] = n2.fromNormalizedToCartographic(a3, o3, at2);
    return t2.lon = s3, t2.lat = c3, t2.height = e2.z, t2;
  }
  getNormalizedToPosition(e2, t2, n2, r2) {
    let { scale: i3, offset: a3 } = this;
    return r2.set(e2 * i3.x + a3.x, t2 * i3.y + a3.y, n2);
  }
  getCartographicToNormal(e2, t2, n2) {
    return n2.set(0, 0, 1);
  }
  getPositionToNormal(e2, t2) {
    return t2.set(0, 0, 1);
  }
};
var st2 = Symbol("TILE_X");
var ct2 = Symbol("TILE_Y");
var lt2 = Symbol("TILE_LEVEL");
var ut2 = 30;
var dt2 = 15;
var ft2 = 20;
var pt2 = Symbol("OVERLAY_RANGE");
var mt2 = Symbol("OVERLAY_LEVEL");
var z4 = /* @__PURE__ */ new L4();
var ht2 = /* @__PURE__ */ new L4();
var gt2 = /* @__PURE__ */ new Ee2();
var _t2 = [0, 0];
var vt2 = class {
  get shape() {
    return console.warn('GeneratedSurfacePlugin: "shape" is deprecated. Use "projection" instead.'), this.projection === "ellipsoid" ? "ellipsoid" : "planar";
  }
  set shape(e2) {
    console.warn('GeneratedSurfacePlugin: "shape" is deprecated. Use "projection" instead.'), this.projection = e2 === "planar" ? "source" : "ellipsoid";
  }
  constructor(e2 = {}) {
    let { overlay: t2 = null, shape: n2 = null, projection: r2 = null, endCaps: i3 = true, center: a3 = true, useRecommendedSettings: o3 = true, applyOverlayTexture: s3 = false } = e2;
    this.priority = -10, this.tiles = null, this.overlay = t2, this.projection = r2 ?? "ellipsoid", n2 !== null && (console.warn('GeneratedSurfacePlugin: "shape" is deprecated. Use "projection" instead.'), r2 === null && (this.projection = n2 === "planar" ? "source" : "ellipsoid")), this.endCaps = i3, this.center = a3, this.useRecommendedSettings = o3, this.applyOverlayTexture = s3, this._tiling = null;
  }
  init(e2) {
    this.useRecommendedSettings && (e2.errorTarget = 1), this.tiles = e2;
  }
  async loadRootTileset() {
    let { overlay: e2 } = this;
    e2 ? (await e2.init(), this._tiling = e2.tiling || this._createDefaultTiling()) : this._tiling = this._createDefaultTiling();
    let { projection: t2 } = this, n2 = t2 === "ellipsoid" || t2 === "source" ? this._tiling.projection : new R5(t2), r2;
    if (n2.isCartographic) {
      let [e3, t3] = n2.getProjectedExtents();
      r2 = e3 / t3;
    } else r2 = this._tiling.aspectRatio;
    if (!(n2.isCartographic && this.projection === "ellipsoid")) {
      let e3 = new ot2(n2);
      e3.scale.set(r2, 1), this.center && e3.offset.set(-r2 / 2, -0.5), this.tiles.surface = e3;
    }
    return this.getTileset();
  }
  async parseToMesh(e2, t2, n2, r2, i3) {
    if (n2 !== "generated_surface") return null;
    let a3 = this._createSurfaceMesh(t2), { overlay: o3, applyOverlayTexture: s3 } = this;
    if (o3 && s3) {
      let e3 = t2[st2], n3 = t2[ct2], r3 = t2[lt2], s4 = this._tiling.getTileBounds(e3, n3, r3, true, false);
      if (o3.hasContent(s4, r3)) {
        try {
          await o3.lockTexture(s4, r3);
        } catch (e5) {
          if (e5.name !== "AbortError") throw e5;
          return null;
        }
        let e4 = o3.getTexture(s4, r3);
        if (t2[pt2] = s4, t2[mt2] = r3, i3.aborted) return o3.releaseTexture(s4, r3), delete t2[pt2], delete t2[mt2], null;
        a3.material.map = e4, a3.material.needsUpdate = true;
      }
    }
    return a3;
  }
  preprocessNode(e2) {
    let t2 = this._tiling.maxLevel;
    e2[lt2] < t2 && e2.parent !== null && this.expandChildren(e2);
  }
  disposeTile(e2) {
    let t2 = e2[pt2];
    this.overlay && t2 && (this.overlay.releaseTexture(t2, e2[mt2]), delete e2[pt2], delete e2[mt2]);
  }
  dispose() {
    this.tiles.forEachLoadedModel((e2, t2) => {
      this.disposeTile(t2);
    });
  }
  getCartographicFromPosition(e2, t2 = {}) {
    return console.warn('GeneratedSurfacePlugin: "getCartographicFromPosition" is deprecated. Use "TilesRenderer.surface" instead.'), this.tiles.surface.getPositionToCartographic(e2, t2);
  }
  getPositionFromCartographic(e2, t2, n2 = new L4()) {
    return console.warn('GeneratedSurfacePlugin: "getPositionFromCartographic" is deprecated. Use "TilesRenderer.surface" instead.'), this.tiles.surface.getCartographicToPosition(e2, t2, 0, n2);
  }
  _createSurfaceMesh(e2) {
    let { tiles: t2, endCaps: n2, _tiling: r2 } = this, { surface: i3 } = t2, { projection: a3 } = r2, o3 = e2[lt2], s3 = e2[st2], c3 = e2[ct2], [l3, u4, d5, f4] = r2.getTileBounds(s3, c3, o3), p4 = Math.max(dt2, Math.ceil((f4 - u4) * N4.RAD2DEG * 0.25)), m4 = Math.max(ut2, Math.ceil((d5 - l3) * N4.RAD2DEG * 0.25)), h5 = m4 + 3, g5 = p4 + 3, _6 = new pe2(1, 1, m4 + 2, p4 + 2), [v6, y6, b6, x6] = r2.getTileBounds(s3, c3, o3, true, true), S5 = r2.getTileContentUVBounds(s3, c3, o3), C5 = n2 && !(i3.projection && i3.projection.isMercator), { position: w5, normal: T6, uv: E5 } = _6.attributes, D6 = w5.count;
    e2.engineData.boundingVolume.getSphere(gt2);
    for (let t3 = 0; t3 < D6; t3++) {
      let n3 = t3 % h5, r3 = Math.floor(t3 / h5), o4 = n3 === 0 || n3 === h5 - 1 || r3 === 0 || r3 === g5 - 1, s4 = Math.max(1, Math.min(h5 - 2, n3)), c4 = Math.max(1, Math.min(g5 - 2, r3)), l4 = (s4 - 1) / m4, d6 = 1 - (c4 - 1) / p4, _7 = N4.mapLinear(l4, 0, 1, v6, b6), D7 = N4.mapLinear(d6, 0, 1, y6, x6), O6 = _7, k5 = D7;
      if (a3.isCartographic) {
        let e3 = a3.fromNormalizedToCartographic(_7, D7, _t2), t4 = e3[0], n4 = e3[1];
        if (a3.isMercator && C5 && (x6 === 1 && d6 === 1 && (n4 = Math.PI / 2), y6 === 0 && d6 === 0 && (n4 = -Math.PI / 2)), a3.isMercator && d6 !== 0 && d6 !== 1) {
          let e4 = a3.fromNormalizedToCartographic(0.5, 1, _t2)[1], t5 = 1 / p4, r4 = N4.mapLinear(d6 - t5, 0, 1, u4, f4), i4 = N4.mapLinear(d6 + t5, 0, 1, u4, f4);
          n4 > e4 && r4 < e4 && (n4 = e4), n4 < -e4 && i4 > -e4 && (n4 = -e4);
        }
        i3.getCartographicToPosition(n4, t4, 0, z4).sub(gt2.center), i3.getCartographicToNormal(n4, t4, ht2), a3.fromCartographicToNormalized(t4, n4, _t2), O6 = _t2[0], k5 = _t2[1];
      } else i3.getNormalizedToPosition(_7, D7, 0, z4).sub(gt2.center), i3.getCartographicToNormal(0, 0, ht2);
      o4 && z4.addScaledVector(ht2, -e2.geometricError);
      let A6 = N4.mapLinear(O6, v6, b6, S5[0], S5[2]), j5 = N4.mapLinear(k5, y6, x6, S5[1], S5[3]);
      w5.setXYZ(t3, z4.x, z4.y, z4.z), T6.setXYZ(t3, ht2.x, ht2.y, ht2.z), E5.setXY(t3, A6, j5);
    }
    let O5 = new ce3(_6, new F4());
    return O5.position.copy(gt2.center), O5;
  }
  getTileset() {
    let { tiles: e2, _tiling: t2 } = this, n2 = t2.minLevel, { tileCountX: r2, tileCountY: i3 } = t2.getLevel(n2), a3 = [];
    for (let e3 = 0; e3 < r2; e3++) for (let t3 = 0; t3 < i3; t3++) {
      let r3 = this.createChild(e3, t3, n2);
      r3 !== null && a3.push(r3);
    }
    let o3 = {
      asset: { version: "1.1" },
      geometricError: Infinity,
      root: {
        refine: "REPLACE",
        geometricError: Infinity,
        boundingVolume: this.createBoundingVolume(0, 0, -1),
        children: a3,
        [lt2]: -1,
        [st2]: 0,
        [ct2]: 0
      }
    };
    return e2.preprocessTileset(o3, ""), o3;
  }
  getUrl() {
    return "tile.generated_surface";
  }
  fetchData(e2) {
    if (/generated_surface/.test(e2)) return /* @__PURE__ */ new ArrayBuffer();
  }
  createBoundingVolume(e2, t2, n2, r2 = 0) {
    let { _tiling: i3, endCaps: a3 } = this, { surface: o3 } = this.tiles, s3 = n2 === -1;
    if (o3.isEllipsoid) {
      let o4, c3;
      return s3 ? (o4 = i3.getContentBounds(true), c3 = i3.getContentBounds()) : (o4 = i3.getTileBounds(e2, t2, n2, true, true), c3 = i3.getTileBounds(e2, t2, n2, false, true)), a3 && (o4[3] === 1 && (c3[3] = Math.PI / 2), o4[1] === 0 && (c3[1] = -Math.PI / 2)), { region: [
        ...c3,
        -r2,
        1
      ] };
    } else {
      let r3;
      r3 = s3 ? i3.getContentBounds(true) : i3.getTileBounds(e2, t2, n2, true);
      let [c3, l3, u4, d5] = r3, f4 = N4.clamp(i3.projection.fromCartographicToNormalized(0, 0, _t2)[1], l3, d5), p4 = Infinity, m4 = Infinity, h5 = -Infinity, g5 = -Infinity;
      for (let e3 of [
        l3,
        d5,
        f4
      ]) for (let t3 of [c3, u4]) {
        if (i3.projection.isCartographic) {
          let [n3, r4] = i3.projection.fromNormalizedToCartographic(t3, e3, _t2), s4 = r4;
          a3 && !o3.projection.isMercator && (e3 === 1 && (s4 = Math.PI / 2), e3 === 0 && (s4 = -Math.PI / 2)), o3.getCartographicToPosition(s4, n3, 0, z4);
        } else o3.getNormalizedToPosition(t3, e3, 0, z4);
        p4 = Math.min(p4, z4.x), m4 = Math.min(m4, z4.y), h5 = Math.max(h5, z4.x), g5 = Math.max(g5, z4.y);
      }
      let _6 = { box: [
        (p4 + h5) / 2,
        (m4 + g5) / 2,
        0,
        (h5 - p4) / 2,
        0,
        0,
        0,
        (g5 - m4) / 2,
        0,
        0,
        0,
        0
      ] };
      return i3.projection.isCartographic && (_6.cartographicRange = s3 ? i3.getContentBounds() : i3.getTileBounds(e2, t2, n2)), _6;
    }
  }
  createChild(e2, t2, n2) {
    let { _tiling: r2 } = this, { projection: i3 } = r2;
    if (!r2.getTileExists(e2, t2, n2)) return null;
    let a3, { surface: o3 } = this.tiles, s3 = o3.isEllipsoid;
    if (s3) {
      let [o4, s4, c3, l3] = r2.getTileBounds(e2, t2, n2, true), { tilePixelWidth: u4, tilePixelHeight: d5 } = r2.getLevel(n2), f4 = (c3 - o4) / u4, p4 = (l3 - s4) / d5, [, m4, h5, g5] = r2.getTileBounds(e2, t2, n2), _6 = m4 > 0 == g5 > 0 ? Math.min(Math.abs(m4), Math.abs(g5)) : 0, v6 = i3.fromCartographicToNormalized(0, _6, _t2)[1], [y6, b6] = i3.getDerivativeAtNormalizedPoint(o4, v6, _t2), [x6, S5] = Ve2(this.tiles.ellipsoid, _6, h5);
      a3 = Math.max(f4 * y6 * x6, p4 * b6 * S5);
    } else {
      let { pixelWidth: e3, pixelHeight: t3 } = r2.getLevel(n2);
      a3 = Math.max(o3.scale.x / e3, o3.scale.y / t3);
    }
    return {
      refine: "REPLACE",
      geometricError: a3,
      boundingVolume: this.createBoundingVolume(e2, t2, n2, s3 ? a3 : 0),
      content: { uri: this.getUrl(e2, t2, n2) },
      children: [],
      [st2]: e2,
      [ct2]: t2,
      [lt2]: n2
    };
  }
  expandChildren(e2) {
    let t2 = e2[lt2], n2 = e2[st2], r2 = e2[ct2], { tileSplitX: i3, tileSplitY: a3 } = this._tiling.getLevel(t2);
    for (let o3 = 0; o3 < i3; o3++) for (let s3 = 0; s3 < a3; s3++) {
      let c3 = this.createChild(i3 * n2 + o3, a3 * r2 + s3, t2 + 1);
      c3 && e2.children.push(c3);
    }
  }
  _createDefaultTiling() {
    let e2 = new it2();
    if (this.projection === "ellipsoid") {
      let t2 = new R5("EPSG:3857");
      e2.setProjection(t2), e2.generateLevels(ft2, t2.tileCountX, t2.tileCountY);
    } else {
      let t2 = new R5("none");
      e2.setProjection(t2), e2.generateLevels(ft2, 1, 1);
    }
    return e2;
  }
};
var yt2 = class extends DOMException {
  constructor() {
    super("DataCache: Item removed", "AbortError");
  }
};
function bt2(...e2) {
  return e2.join("_");
}
var xt2 = class {
  constructor() {
    this.cache = {}, this.count = 0, this.cachedBytes = 0, this.active = 0;
  }
  fetchItem(e2, t2) {
  }
  disposeItem(e2, t2) {
  }
  getMemoryUsage(e2) {
    return 0;
  }
  setData(...e2) {
    let { cache: t2 } = this, n2 = e2.pop(), r2 = bt2(...e2);
    if (r2 in t2) throw Error(`DataCache: "${r2}" is already present.`);
    return this.cache[r2] = {
      abortController: new AbortController(),
      result: n2,
      count: 1,
      bytes: this.getMemoryUsage(n2)
    }, this.count++, this.cachedBytes += this.cache[r2].bytes, n2;
  }
  lock(...e2) {
    let { cache: t2 } = this, n2 = bt2(...e2);
    if (n2 in t2) t2[n2].count++;
    else {
      let t3 = new AbortController(), r2 = {
        abortController: t3,
        result: null,
        count: 1,
        bytes: 0,
        args: e2
      };
      this.active++, r2.result = this.fetchItem(e2, t3.signal), r2.result instanceof Promise ? r2.result = r2.result.then((e3) => (t3.signal.throwIfAborted(), r2.result = e3, r2.bytes = this.getMemoryUsage(e3), this.cachedBytes += r2.bytes, e3)).finally(() => {
        this.active--;
      }) : (this.active--, r2.bytes = this.getMemoryUsage(r2.result), this.cachedBytes += r2.bytes), this.cache[n2] = r2, this.count++;
    }
    return t2[n2].result;
  }
  release(...e2) {
    let t2 = bt2(...e2);
    this.releaseViaFullKey(t2);
  }
  get(...e2) {
    let { cache: t2 } = this, n2 = bt2(...e2);
    return n2 in t2 && t2[n2].count > 0 ? t2[n2].result : null;
  }
  has(...e2) {
    let { cache: t2 } = this;
    return bt2(...e2) in t2;
  }
  forEachItem(e2) {
    let { cache: t2 } = this;
    for (let n2 in t2) {
      let r2 = t2[n2];
      r2.result instanceof Promise || e2(r2.result, r2.args);
    }
  }
  dispose() {
    let { cache: e2 } = this;
    for (let t2 in e2) {
      let { abortController: n2 } = e2[t2];
      n2.abort(new yt2()), this.releaseViaFullKey(t2, true);
    }
    this.cache = {};
  }
  releaseViaFullKey(e2, t2 = false) {
    let { cache: n2 } = this;
    if (e2 in n2 && n2[e2].count > 0) {
      let r2 = n2[e2];
      if (r2.count--, r2.count === 0 || t2) {
        let i3 = () => {
          if (n2[e2] !== r2) return;
          let { result: t3, abortController: i4 } = r2;
          i4.abort(new yt2()), t3 instanceof Promise ? t3.then((e3) => {
            this.disposeItem(e3, r2.args);
          }).catch(() => {
            this.disposeItem(null, r2.args);
          }).finally(() => {
            this.count--, this.cachedBytes -= r2.bytes;
          }) : (this.disposeItem(t3, r2.args), this.count--, this.cachedBytes -= r2.bytes), delete n2[e2];
        };
        t2 ? i3() : queueMicrotask(() => {
          r2.count === 0 && i3();
        });
      }
      return true;
    }
    throw Error("DataCache: Attempting to release key that does not exist");
  }
};
var St2 = class extends xt2 {
  constructor(e2 = {}) {
    super();
    let { fetchOptions: t2 = {} } = e2;
    this.tiling = new it2(), this.fetchOptions = t2, this.fetchData = (...e3) => fetch(...e3);
  }
  init() {
  }
  async processBufferToTexture(e2) {
    let t2 = new Blob([e2]), n2 = new Oe2(await createImageBitmap(t2, {
      premultiplyAlpha: "none",
      colorSpaceConversion: "none",
      imageOrientation: "flipY"
    }));
    return n2.generateMipmaps = false, n2.colorSpace = Ce2, n2.needsUpdate = true, n2;
  }
  getMemoryUsage(e2) {
    let { format: t2, type: n2, image: r2, generateMipmaps: i3 } = e2, { width: a3, height: o3 } = r2, s3 = ke2.getByteLength(a3, o3, t2, n2);
    return i3 ? s3 * 4 / 3 : s3;
  }
  fetchItem(e2, t2) {
    let n2 = {
      ...this.fetchOptions,
      signal: t2
    }, r2 = this.getUrl(...e2);
    return this.fetchData(r2, n2).then((e3) => e3.arrayBuffer()).then((e3) => this.processBufferToTexture(e3));
  }
  disposeItem(e2) {
    e2 && (e2.dispose(), e2.image instanceof ImageBitmap && e2.image.close());
  }
  getUrl(...e2) {
  }
};
var Ct2 = class extends St2 {
  constructor(e2 = {}) {
    let { levels: t2 = 20, tileDimension: n2 = 256, projection: r2 = "EPSG:3857", url: i3 = null, ...a3 } = e2;
    super(a3), this.tileDimension = n2, this.levels = t2, this.projection = r2, this.url = i3;
  }
  getUrl(e2, t2, n2) {
    return this.url.replace(/{\s*z\s*}/gi, n2).replace(/{\s*x\s*}/gi, e2).replace(/{\s*(y|reverseY|-\s*y)\s*}/gi, t2);
  }
  init() {
    let { tiling: e2, tileDimension: t2, levels: n2, url: r2, projection: i3 } = this;
    return e2.flipY = !/{\s*reverseY|-\s*y\s*}/g.test(r2), e2.setProjection(new R5(i3)), e2.setContentBounds(...e2.projection.getBounds()), Array.isArray(n2) ? n2.forEach((n3, r3) => {
      n3 !== null && e2.setLevel(r3, {
        tilePixelWidth: t2,
        tilePixelHeight: t2,
        ...n3
      });
    }) : e2.generateLevels(n2, e2.projection.tileCountX, e2.projection.tileCountY, {
      tilePixelWidth: t2,
      tilePixelHeight: t2
    }), this.url = r2, Promise.resolve();
  }
};
var wt2 = class extends Ct2 {
  constructor(e2 = {}) {
    let { subdomains: t2 = ["t0"], ...n2 } = e2;
    super(n2), this.subdomains = t2, this.subDomainIndex = 0;
  }
  getUrl(e2, t2, n2) {
    return this.url.replace(/{\s*subdomain\s*}/gi, this._getSubdomain()).replace(/{\s*quadkey\s*}/gi, this._tileToQuadKey(e2, t2, n2));
  }
  _tileToQuadKey(e2, t2, n2) {
    let r2 = "";
    for (let i3 = n2; i3 > 0; i3--) {
      let n3 = 0, a3 = 1 << i3 - 1;
      (e2 & a3) !== 0 && (n3 += 1), (t2 & a3) !== 0 && (n3 += 2), r2 += n3.toString();
    }
    return r2;
  }
  _getSubdomain() {
    return this.subDomainIndex = (this.subDomainIndex + 1) % this.subdomains.length, this.subdomains[this.subDomainIndex];
  }
};
var Tt2 = class extends St2 {
  constructor(e2 = {}) {
    let { url: t2 = null, ...n2 } = e2;
    super(n2), this.tileSets = null, this.extension = null, this.url = t2;
  }
  getUrl(e2, t2, n2) {
    let { url: r2, extension: i3, tileSets: a3, tiling: o3 } = this;
    return new URL(`${parseInt(a3[n2 - o3.minLevel].href)}/${e2}/${t2}.${i3}`, r2).toString();
  }
  init() {
    let { url: e2 } = this;
    return this.fetchData(new URL("tilemapresource.xml", e2), this.fetchOptions).then((e3) => e3.text()).then((t2) => {
      let { tiling: n2 } = this, r2 = new DOMParser().parseFromString(t2, "text/xml"), i3 = r2.querySelector("BoundingBox"), a3 = r2.querySelector("TileFormat"), o3 = [...r2.querySelector("TileSets").querySelectorAll("TileSet")].map((e3) => ({
        href: parseInt(e3.getAttribute("href")),
        unitsPerPixel: parseFloat(e3.getAttribute("units-per-pixel")),
        order: parseInt(e3.getAttribute("order"))
      })).sort((e3, t3) => e3.order - t3.order), s3 = parseFloat(i3.getAttribute("minx")) * N4.DEG2RAD, c3 = parseFloat(i3.getAttribute("maxx")) * N4.DEG2RAD, l3 = parseFloat(i3.getAttribute("miny")) * N4.DEG2RAD, u4 = parseFloat(i3.getAttribute("maxy")) * N4.DEG2RAD, d5 = parseInt(a3.getAttribute("width")), f4 = parseInt(a3.getAttribute("height")), p4 = a3.getAttribute("extension"), m4 = r2.querySelector("SRS").textContent;
      this.extension = p4, this.url = e2, this.tileSets = o3, n2.setProjection(new R5(m4)), n2.setContentBounds(s3, l3, c3, u4), o3.forEach(({ order: e3 }) => {
        n2.setLevel(e3, {
          tileCountX: n2.projection.tileCountX * 2 ** e3,
          tilePixelWidth: d5,
          tilePixelHeight: f4
        });
      });
    });
  }
};
function Et2(e2, t2, n2, r2) {
  let [i3, a3, o3, s3] = e2, c3 = (o3 - i3) * 1e-4, l3 = (s3 - a3) * 1e-4;
  a3 += l3, i3 += c3, s3 -= l3, o3 -= c3;
  let u4 = Math.max(Math.min(t2, n2.maxLevel), n2.minLevel), [d5, f4, p4, m4] = n2.getTilesInRange(i3, a3, o3, s3, u4, true);
  for (let e3 = d5; e3 <= p4; e3++) for (let t3 = f4; t3 <= m4; t3++) r2(e3, t3, u4);
}
function Dt2(e2, t2, n2) {
  let r2 = new L4(), i3 = {}, a3 = [], o3 = e2.getAttribute("position");
  e2.computeBoundingBox(), e2.boundingBox.getCenter(r2).applyMatrix4(t2), n2.getPositionToCartographic(r2, i3);
  let s3 = i3.lat || 0, c3 = i3.lon || 0, l3 = Infinity, u4 = Infinity, d5 = Infinity, f4 = -Infinity, p4 = -Infinity, m4 = -Infinity;
  for (let e3 = 0; e3 < o3.count; e3++) r2.fromBufferAttribute(o3, e3).applyMatrix4(t2), n2.getPositionToCartographic(r2, i3), Math.abs(Math.abs(i3.lat) - Math.PI / 2) < 1e-5 && (i3.lon = c3), Math.abs(c3 - i3.lon) > Math.PI && (i3.lon += Math.sign(c3 - i3.lon) * Math.PI * 2), Math.abs(s3 - i3.lat) > Math.PI && (i3.lat += Math.sign(s3 - i3.lat) * Math.PI * 2), a3.push(i3.lon, i3.lat, i3.height), l3 = Math.min(l3, i3.lat), f4 = Math.max(f4, i3.lat), u4 = Math.min(u4, i3.lon), p4 = Math.max(p4, i3.lon), d5 = Math.min(d5, i3.height), m4 = Math.max(m4, i3.height);
  let h5 = [
    u4,
    l3,
    p4,
    f4
  ];
  return {
    uv: a3,
    range: h5,
    region: [
      ...h5,
      d5,
      m4
    ]
  };
}
function Ot2(e2, t2, n2 = null, r2 = null, i3 = null) {
  let a3 = Infinity, o3 = Infinity, s3 = Infinity, c3 = -Infinity, l3 = -Infinity, u4 = -Infinity, d5 = [], f4 = new P4();
  if (e2.forEach((e3) => {
    f4.copy(e3.matrixWorld), n2 && f4.premultiply(n2);
    let { uv: r3, region: i4 } = Dt2(e3.geometry, f4, t2);
    d5.push(r3), a3 = Math.min(a3, i4[1]), c3 = Math.max(c3, i4[3]), o3 = Math.min(o3, i4[0]), l3 = Math.max(l3, i4[2]), s3 = Math.min(s3, i4[4]), u4 = Math.max(u4, i4[5]);
  }), r2 !== null) {
    i3 === null && (i3 = r2.clampToBounds([
      o3,
      a3,
      l3,
      c3
    ]), i3 = r2.fromCartographicToNormalizedRange(i3));
    let [e3, t3, n3, f5] = i3, p4 = u4 - s3;
    d5.forEach((i4) => {
      for (let a4 = 0, o4 = i4.length; a4 < o4; a4 += 3) {
        let o5 = i4[a4 + 0], c4 = i4[a4 + 1], l4 = i4[a4 + 2], [d6, m4] = r2.fromCartographicToNormalized(o5, c4);
        d6 = N4.clamp(d6, 0, 1), m4 = N4.clamp(m4, 0, 1), i4[a4 + 0] = N4.mapLinear(d6, e3, n3, 0, 1), i4[a4 + 1] = N4.mapLinear(m4, t3, f5, 0, 1), i4[a4 + 2] = p4 === 0 ? 0.5 : N4.mapLinear(l4, s3, u4, 0, 1);
      }
    });
  }
  return {
    uvs: d5,
    range: i3,
    region: [
      o3,
      a3,
      l3,
      c3,
      s3,
      u4
    ]
  };
}
function kt2(e2, t2) {
  let n2 = new L4(), r2 = [], i3 = e2.getAttribute("position"), a3 = Infinity, o3 = Infinity, s3 = Infinity, c3 = -Infinity, l3 = -Infinity, u4 = -Infinity;
  for (let e3 = 0; e3 < i3.count; e3++) n2.fromBufferAttribute(i3, e3).applyMatrix4(t2), r2.push(n2.x, n2.y, n2.z), a3 = Math.min(a3, n2.x), c3 = Math.max(c3, n2.x), o3 = Math.min(o3, n2.y), l3 = Math.max(l3, n2.y), s3 = Math.min(s3, n2.z), u4 = Math.max(u4, n2.z);
  return {
    uv: r2,
    range: [
      a3,
      o3,
      c3,
      l3
    ],
    heightRange: [s3, u4]
  };
}
function At2(e2, t2) {
  let n2 = Infinity, r2 = Infinity, i3 = Infinity, a3 = -Infinity, o3 = -Infinity, s3 = -Infinity, c3 = [], l3 = new P4();
  return e2.forEach((e3) => {
    l3.copy(e3.matrixWorld), t2 && l3.premultiply(t2);
    let { uv: u4, range: d5, heightRange: f4 } = kt2(e3.geometry, l3);
    c3.push(u4), n2 = Math.min(n2, d5[0]), a3 = Math.max(a3, d5[2]), r2 = Math.min(r2, d5[1]), o3 = Math.max(o3, d5[3]), i3 = Math.min(i3, f4[0]), s3 = Math.max(s3, f4[1]);
  }), c3.forEach((e3) => {
    for (let t3 = 0, i4 = e3.length; t3 < i4; t3 += 3) {
      let i5 = e3[t3 + 0], s4 = e3[t3 + 1];
      e3[t3 + 0] = N4.mapLinear(i5, n2, a3, 0, 1), e3[t3 + 1] = N4.mapLinear(s4, r2, o3, 0, 1);
    }
  }), {
    uvs: c3,
    range: [
      n2,
      r2,
      a3,
      o3
    ],
    heightRange: [i3, s3]
  };
}
var jt2 = Symbol("OVERLAY_PARAMS");
function Mt2(e2, t2) {
  if (e2[jt2]) return e2[jt2];
  let n2 = {
    layerMaps: { value: [] },
    layerInfo: { value: [] }
  };
  return e2[jt2] = n2, e2.defines = {
    ...e2.defines || {},
    LAYER_COUNT: 0
  }, e2.onBeforeCompile = (e3) => {
    t2 && t2(e3), e3.uniforms = {
      ...e3.uniforms,
      ...n2
    }, e3.vertexShader = e3.vertexShader.replace(/void main\(\s*\)\s*{/, (e4) => `

				#pragma unroll_loop_start
					for ( int i = 0; i < 10; i ++ ) {

						#if UNROLLED_LOOP_INDEX < LAYER_COUNT

							attribute vec3 layer_uv_UNROLLED_LOOP_INDEX;
							varying vec3 v_layer_uv_UNROLLED_LOOP_INDEX;

						#endif


					}
				#pragma unroll_loop_end

				${e4}

				#pragma unroll_loop_start
					for ( int i = 0; i < 10; i ++ ) {

						#if UNROLLED_LOOP_INDEX < LAYER_COUNT

							v_layer_uv_UNROLLED_LOOP_INDEX = layer_uv_UNROLLED_LOOP_INDEX;

						#endif

					}
				#pragma unroll_loop_end

			`), e3.fragmentShader = e3.fragmentShader.replace(/void main\(/, (e4) => `

				#if LAYER_COUNT != 0
					struct LayerInfo {
						vec3 color;
						float opacity;

						int alphaMask;
						int alphaInvert;
					};

					uniform sampler2D layerMaps[ LAYER_COUNT ];
					uniform LayerInfo layerInfo[ LAYER_COUNT ];
				#endif

				#pragma unroll_loop_start
					for ( int i = 0; i < 10; i ++ ) {

						#if UNROLLED_LOOP_INDEX < LAYER_COUNT

							varying vec3 v_layer_uv_UNROLLED_LOOP_INDEX;

						#endif

					}
				#pragma unroll_loop_end

				${e4}

			`).replace(/#include <color_fragment>/, (e4) => `

				${e4}

				#if LAYER_COUNT != 0
				{
					vec4 tint;
					vec3 layerUV;
					float layerOpacity;
					float wOpacity;
					float wDelta;
					#pragma unroll_loop_start
						for ( int i = 0; i < 10; i ++ ) {

							#if UNROLLED_LOOP_INDEX < LAYER_COUNT

								layerUV = v_layer_uv_UNROLLED_LOOP_INDEX;
								tint = texture( layerMaps[ i ], layerUV.xy );

								// discard texture outside 0, 1 on w - offset the stepped value by an epsilon to avoid cases
								// where wDelta is near 0 (eg a flat surface) at the w boundary, resulting in artifacts on some
								// hardware.
								wDelta = max( fwidth( layerUV.z ), 1e-7 );
								wOpacity =
									smoothstep( - wDelta, 0.0, layerUV.z ) *
									smoothstep( 1.0 + wDelta, 1.0, layerUV.z );

								// apply tint & opacity
								tint.rgb *= layerInfo[ i ].color;
								tint.rgba *= layerInfo[ i ].opacity * wOpacity;

								// invert the alpha
								if ( layerInfo[ i ].alphaInvert > 0 ) {

									tint.a = 1.0 - tint.a;

								}

								// apply the alpha across all existing layers if alpha mask is true
								if ( layerInfo[ i ].alphaMask > 0 ) {

									diffuseColor.a *= tint.a;

								} else {

									tint.rgb *= tint.a;
									diffuseColor = tint + diffuseColor * ( 1.0 - tint.a );

								}

							#endif

						}
					#pragma unroll_loop_end
				}
				#endif
			`);
  }, n2;
}
var B4 = 0;
var Nt2 = [
  "a",
  "b",
  "c"
];
var V4 = /* @__PURE__ */ new Me2();
var Pt2 = /* @__PURE__ */ new Me2();
var Ft2 = /* @__PURE__ */ new Me2();
var It2 = /* @__PURE__ */ new Me2();
var Lt2 = class {
  constructor() {
    this.attributeList = null, this.splitOperations = [], this.trianglePool = new Rt2();
  }
  forEachSplitPermutation(e2) {
    let { splitOperations: t2 } = this, n2 = (r2 = 0) => {
      if (r2 >= t2.length) {
        e2();
        return;
      }
      t2[r2].keepPositive = true, n2(r2 + 1), t2[r2].keepPositive = false, n2(r2 + 1);
    };
    n2();
  }
  addSplitOperation(e2, t2 = true) {
    this.splitOperations.push({
      callback: e2,
      keepPositive: t2
    });
  }
  clearSplitOperations() {
    this.splitOperations.length = 0;
  }
  clipObject(e2) {
    let t2 = e2.clone(), n2 = [];
    return t2.traverse((e3) => {
      e3.isMesh && (e3.geometry = this.clip(e3).geometry, (e3.geometry.index ? e3.geometry.index.count / 3 : e3.attributes.position.count / 3) == 0 && n2.push(e3));
    }), n2.forEach((e3) => {
      e3.removeFromParent();
    }), t2;
  }
  clip(e2, t2 = null) {
    let n2 = this.getClippedData(e2, t2);
    return this.constructMesh(n2.attributes, n2.index, e2);
  }
  getClippedData(e2, t2 = null, n2 = {}) {
    let { trianglePool: r2, splitOperations: i3, attributeList: a3 } = this, o3 = e2.geometry, s3 = o3.attributes.position, c3 = o3.index, l3 = 0, u4 = {};
    n2.index = n2.index || [], n2.vertexIsClipped = n2.vertexIsClipped || [], n2.attributes = n2.attributes || {};
    for (let e3 in o3.attributes) a3 !== null && (a3 instanceof Function && !a3(e3) || Array.isArray(a3) && !a3.includes(e3)) || (n2.attributes[e3] = []);
    let d5 = 0, f4 = c3 ? c3.count : s3.count;
    t2 !== null && (d5 = t2.start, f4 = t2.count);
    for (let t3 = d5, n3 = d5 + f4; t3 < n3; t3 += 3) {
      let n4 = t3 + 0, a4 = t3 + 1, s4 = t3 + 2;
      c3 && (n4 = c3.getX(n4), a4 = c3.getX(a4), s4 = c3.getX(s4));
      let l4 = r2.get();
      l4.initFromIndices(n4, a4, s4);
      let u5 = [l4];
      for (let t4 = 0; t4 < i3.length; t4++) {
        let { keepPositive: n5, callback: r3 } = i3[t4], a5 = [];
        for (let t5 = 0; t5 < u5.length; t5++) {
          let i4 = u5[t5], { indices: s5, barycoord: c4 } = i4;
          i4.clipValues.a = r3(o3, s5.a, s5.b, s5.c, c4.a, e2.matrixWorld), i4.clipValues.b = r3(o3, s5.a, s5.b, s5.c, c4.b, e2.matrixWorld), i4.clipValues.c = r3(o3, s5.a, s5.b, s5.c, c4.c, e2.matrixWorld), this.splitTriangle(i4, !n5, a5);
        }
        u5 = a5;
      }
      for (let e3 = 0, t4 = u5.length; e3 < t4; e3++) {
        let t5 = u5[e3];
        p4(t5, o3);
      }
      r2.reset();
    }
    return n2;
    function p4(e3, t3) {
      for (let r3 = 0; r3 < 3; r3++) {
        let i4 = e3.getVertexHash(r3, t3);
        i4 in u4 || (u4[i4] = l3, l3++, e3.getVertexData(r3, t3, n2.attributes), n2.vertexIsClipped.push(e3.clipValues[Nt2[r3]] === B4));
        let a4 = u4[i4];
        n2.index.push(a4);
      }
    }
  }
  constructMesh(e2, t2, n2) {
    let r2 = n2.geometry, i3 = new S4(), a3 = e2.position.length / 3 > 65535 ? new Uint32Array(t2) : new Uint16Array(t2);
    i3.setIndex(new x5(a3, 1, false));
    for (let t3 in e2) {
      let n3 = r2.getAttribute(t3), a4 = new x5(new n3.array.constructor(e2[t3]), n3.itemSize, n3.normalized);
      a4.gpuType = n3.gpuType, i3.setAttribute(t3, a4);
    }
    let o3 = new ce3(i3, n2.material.clone());
    return o3.position.copy(n2.position), o3.quaternion.copy(n2.quaternion), o3.scale.copy(n2.scale), o3;
  }
  splitTriangle(e2, t2, n2) {
    let { trianglePool: r2 } = this, i3 = [], a3 = [], o3 = [];
    for (let t3 = 0; t3 < 3; t3++) {
      let n3 = Nt2[t3], r3 = Nt2[(t3 + 1) % 3], s3 = e2.clipValues[n3], c3 = e2.clipValues[r3];
      (s3 < B4 != c3 < B4 || s3 === B4) && (i3.push(t3), a3.push([n3, r3]), s3 === c3 ? o3.push(0) : o3.push(N4.mapLinear(B4, s3, c3, 0, 1)));
    }
    if (i3.length !== 2) Math.min(e2.clipValues.a, e2.clipValues.b, e2.clipValues.c) < B4 === t2 && n2.push(e2);
    else if (i3.length === 2) {
      let s3 = r2.get().initFromTriangle(e2), c3 = r2.get().initFromTriangle(e2), l3 = r2.get().initFromTriangle(e2);
      (i3[0] + 1) % 3 === i3[1] ? (s3.lerpVertexFromEdge(e2, a3[0][0], a3[0][1], o3[0], "a"), s3.copyVertex(e2, a3[0][1], "b"), s3.lerpVertexFromEdge(e2, a3[1][0], a3[1][1], o3[1], "c"), s3.clipValues.a = B4, s3.clipValues.c = B4, c3.lerpVertexFromEdge(e2, a3[0][0], a3[0][1], o3[0], "a"), c3.copyVertex(e2, a3[1][1], "b"), c3.copyVertex(e2, a3[0][0], "c"), c3.clipValues.a = B4, l3.lerpVertexFromEdge(e2, a3[0][0], a3[0][1], o3[0], "a"), l3.lerpVertexFromEdge(e2, a3[1][0], a3[1][1], o3[1], "b"), l3.copyVertex(e2, a3[1][1], "c"), l3.clipValues.a = B4, l3.clipValues.b = B4) : (s3.lerpVertexFromEdge(e2, a3[0][0], a3[0][1], o3[0], "a"), s3.lerpVertexFromEdge(e2, a3[1][0], a3[1][1], o3[1], "b"), s3.copyVertex(e2, a3[0][0], "c"), s3.clipValues.a = B4, s3.clipValues.b = B4, c3.lerpVertexFromEdge(e2, a3[0][0], a3[0][1], o3[0], "a"), c3.copyVertex(e2, a3[0][1], "b"), c3.lerpVertexFromEdge(e2, a3[1][0], a3[1][1], o3[1], "c"), c3.clipValues.a = B4, c3.clipValues.c = B4, l3.copyVertex(e2, a3[0][1], "a"), l3.copyVertex(e2, a3[1][0], "b"), l3.lerpVertexFromEdge(e2, a3[1][0], a3[1][1], o3[1], "c"), l3.clipValues.c = B4);
      let u4, d5;
      u4 = Math.min(s3.clipValues.a, s3.clipValues.b, s3.clipValues.c), d5 = u4 < B4, d5 === t2 && n2.push(s3), u4 = Math.min(c3.clipValues.a, c3.clipValues.b, c3.clipValues.c), d5 = u4 < B4, d5 === t2 && n2.push(c3), u4 = Math.min(l3.clipValues.a, l3.clipValues.b, l3.clipValues.c), d5 = u4 < B4, d5 === t2 && n2.push(l3);
    }
  }
};
var Rt2 = class {
  constructor() {
    this.pool = [], this.index = 0;
  }
  get() {
    if (this.index >= this.pool.length) {
      let e3 = new zt2();
      this.pool.push(e3);
    }
    let e2 = this.pool[this.index];
    return this.index++, e2;
  }
  reset() {
    this.index = 0;
  }
};
var zt2 = class {
  constructor() {
    this.indices = {
      a: -1,
      b: -1,
      c: -1
    }, this.clipValues = {
      a: -1,
      b: -1,
      c: -1
    }, this.barycoord = new Ae2();
  }
  getVertexHash(e2, t2) {
    let { barycoord: n2, indices: r2 } = this, i3 = n2[Nt2[e2]];
    if (i3.x === 1) return r2[Nt2[0]];
    if (i3.y === 1) return r2[Nt2[1]];
    if (i3.z === 1) return r2[Nt2[2]];
    {
      let { attributes: e3 } = t2, n3 = "";
      for (let t3 in e3) {
        let a3 = e3[t3];
        switch (Bt2(a3, r2.a, r2.b, r2.c, i3, V4), (t3 === "normal" || t3 === "tangent" || t3 === "bitangent") && V4.normalize(), a3.itemSize) {
          case 4:
            n3 += Vt2(V4.x, V4.y, V4.z, V4.w);
            break;
          case 3:
            n3 += Vt2(V4.x, V4.y, V4.z);
            break;
          case 2:
            n3 += Vt2(V4.x, V4.y);
            break;
          case 1:
            n3 += Vt2(V4.x);
            break;
        }
        n3 += "|";
      }
      return n3;
    }
  }
  getVertexData(e2, t2, n2) {
    let { barycoord: r2, indices: i3 } = this, a3 = r2[Nt2[e2]], { attributes: o3 } = t2;
    for (let e3 in o3) {
      if (!n2[e3]) continue;
      let t3 = o3[e3], r3 = n2[e3];
      switch (Bt2(t3, i3.a, i3.b, i3.c, a3, V4), (e3 === "normal" || e3 === "tangent" || e3 === "bitangent") && V4.normalize(), t3.itemSize) {
        case 4:
          r3.push(V4.x, V4.y, V4.z, V4.w);
          break;
        case 3:
          r3.push(V4.x, V4.y, V4.z);
          break;
        case 2:
          r3.push(V4.x, V4.y);
          break;
        case 1:
          r3.push(V4.x);
          break;
      }
    }
  }
  initFromTriangle(e2) {
    return this.initFromIndices(e2.indices.a, e2.indices.b, e2.indices.c);
  }
  initFromIndices(e2, t2, n2) {
    return this.indices.a = e2, this.indices.b = t2, this.indices.c = n2, this.clipValues.a = -1, this.clipValues.b = -1, this.clipValues.c = -1, this.barycoord.a.set(1, 0, 0), this.barycoord.b.set(0, 1, 0), this.barycoord.c.set(0, 0, 1), this;
  }
  lerpVertexFromEdge(e2, t2, n2, r2, i3) {
    this.clipValues[i3] = N4.lerp(e2.clipValues[t2], e2.clipValues[n2], r2), this.barycoord[i3].lerpVectors(e2.barycoord[t2], e2.barycoord[n2], r2);
  }
  copyVertex(e2, t2, n2) {
    this.clipValues[n2] = e2.clipValues[t2], this.barycoord[n2].copy(e2.barycoord[t2]);
  }
};
function Bt2(e2, t2, n2, r2, i3, a3) {
  switch (Pt2.fromBufferAttribute(e2, t2), Ft2.fromBufferAttribute(e2, n2), It2.fromBufferAttribute(e2, r2), a3.set(0, 0, 0, 0).addScaledVector(Pt2, i3.x).addScaledVector(Ft2, i3.y).addScaledVector(It2, i3.z), e2.itemSize) {
    case 3:
      V4.w = 0;
      break;
    case 2:
      V4.w = 0, V4.z = 0;
      break;
    case 1:
      V4.w = 0, V4.z = 0, V4.y = 0;
      break;
  }
  return a3;
}
function Vt2(...e2) {
  let t2 = "";
  for (let n2 = 0, r2 = e2.length; n2 < r2; n2++) t2 += ~~(e2[n2] * 1e5 + 0.5), n2 !== r2 - 1 && (t2 += "_");
  return t2;
}
var Ht2 = class extends St2 {
  constructor(e2 = {}) {
    let { layer: t2 = null, tileMatrixSet: n2 = "default", style: r2 = "default", url: i3 = null, format: a3 = "image/jpeg", dimensions: o3 = null, tileMatrixLabels: s3 = null, tileMatrices: c3 = null, projection: l3 = null, levels: u4 = 20, tileDimension: d5 = 256, contentBoundingBox: f4 = null, ...p4 } = e2;
    super(p4), this.layer = t2, this.tileMatrixSet = n2, this.style = r2, this.url = i3, this.format = a3, this.dimensions = o3, this.tileMatrixLabels = s3, this.tileMatrices = c3, this.projection = l3, this.levels = u4, this.tileDimension = d5, this.contentBoundingBox = f4, this._useKvp = false;
  }
  _detectRequestMode(e2) {
    return !/\{/.test(e2);
  }
  init() {
    let { tiling: e2, tileDimension: t2, levels: n2, dimensions: r2, contentBoundingBox: i3, tileMatrices: a3, style: o3, tileMatrixSet: s3 } = this, { url: c3 } = this, l3 = this.projection || "EPSG:3857";
    if (e2.flipY = true, e2.setProjection(new R5(l3)), i3 === null ? e2.setContentBounds(...e2.projection.getBounds()) : e2.setContentBounds(i3[0], i3[1], i3[2], i3[3]), Array.isArray(a3) ? a3.forEach((n3, r3) => {
      let i4 = n3.tileWidth || t2, a4 = n3.tileHeight || t2;
      e2.setLevel(r3, {
        tilePixelWidth: i4,
        tilePixelHeight: a4,
        tileCountX: n3.matrixWidth,
        tileCountY: n3.matrixHeight,
        tileBounds: n3.tileBounds || n3.bounds
      });
    }) : e2.generateLevels(n2, e2.projection.tileCountX, e2.projection.tileCountY, {
      tilePixelWidth: t2,
      tilePixelHeight: t2
    }), this._useKvp = this._detectRequestMode(c3), !this._useKvp && (c3 = c3.replace(/{\s*TileMatrixSet\s*}/gi, s3).replace(/{\s*Style\s*}/gi, o3), r2)) for (let e3 in r2) c3 = c3.replace(RegExp(`{\\s*${e3}\\s*}`, "gi"), r2[e3]);
    return this.url = c3, Promise.resolve();
  }
  getUrl(e2, t2, n2) {
    let { tileMatrices: r2, tileMatrixLabels: i3 } = this, a3;
    return a3 = r2 !== null && r2.length > 0 ? r2[n2].identifier : i3 ? i3[n2] : n2.toString(), this._useKvp ? this._buildKvpUrl(e2, t2, a3) : this._buildRestfulUrl(e2, t2, a3);
  }
  _buildRestfulUrl(e2, t2, n2) {
    return this.url.replace(/{\s*TileMatrix\s*}/gi, n2).replace(/{\s*TileCol\s*}/gi, e2).replace(/{\s*TileRow\s*}/gi, t2);
  }
  _buildKvpUrl(e2, t2, n2) {
    let { dimensions: r2, format: i3 } = this, a3 = this.url, o3 = new URLSearchParams({
      SERVICE: "WMTS",
      VERSION: "1.0.0",
      REQUEST: "GetTile",
      LAYER: this.layer,
      STYLE: this.style,
      TILEMATRIXSET: this.tileMatrixSet,
      TILEMATRIX: n2,
      TILEROW: t2,
      TILECOL: e2,
      FORMAT: i3
    });
    if (r2) for (let e3 in r2) o3.set(e3, r2[e3]);
    return a3 + (a3.includes("?") ? "&" : "?") + o3.toString();
  }
};
var Ut2 = class {
  constructor() {
    this.canvas = null, this.context = null, this.range = [
      0,
      0,
      1,
      1
    ];
  }
  setTarget(e2, t2) {
    this.canvas = e2.image, this.context = e2.image.getContext("2d"), this.range = [...t2];
  }
  draw(e2, t2) {
    let { canvas: n2, range: r2, context: i3 } = this, { width: a3, height: o3 } = n2, { image: s3 } = e2, c3 = Math.round(N4.mapLinear(t2[0], r2[0], r2[2], 0, a3)), l3 = Math.round(N4.mapLinear(t2[1], r2[1], r2[3], 0, o3)), u4 = Math.round(N4.mapLinear(t2[2], r2[0], r2[2], 0, a3)), d5 = Math.round(N4.mapLinear(t2[3], r2[1], r2[3], 0, o3)), f4 = u4 - c3, p4 = d5 - l3;
    s3 instanceof ImageBitmap ? (i3.save(), i3.translate(c3, o3 - l3), i3.scale(1, -1), i3.drawImage(s3, 0, 0, f4, p4), i3.restore()) : i3.drawImage(s3, c3, o3 - l3, f4, -p4);
  }
  clear() {
    let { context: e2, canvas: t2 } = this;
    e2.clearRect(0, 0, t2.width, t2.height);
  }
};
var Wt2 = 1e-10;
function Gt2(e2, t2, n2 = 0) {
  if (e2.length !== t2.length) return false;
  for (let r2 = 0, i3 = e2.length; r2 < i3; r2++) if (Math.abs(e2[r2] - t2[r2]) > n2) return false;
  return true;
}
var Kt2 = class extends xt2 {
  hasContent(...e2) {
    return true;
  }
};
var qt2 = class extends Kt2 {
  constructor(e2) {
    super(), this.tiledImageSource = e2, this.tileComposer = new Ut2(), this.resolution = 256;
  }
  hasContent(e2, t2, n2, r2, i3) {
    let a3 = this.tiledImageSource.tiling, o3 = 0;
    return Et2([
      e2,
      t2,
      n2,
      r2
    ], i3, a3, () => {
      o3++;
    }), o3 !== 0;
  }
  async fetchItem([e2, t2, n2, r2, i3], a3) {
    let { tiledImageSource: o3, tileComposer: s3 } = this, c3 = [
      e2,
      t2,
      n2,
      r2
    ], l3 = o3.tiling;
    await this._markImages(c3, i3, false), a3?.throwIfAborted();
    let u4 = null;
    if (Et2(c3, i3, l3, (e3, t3, n3) => {
      Gt2(l3.getTileBounds(e3, t3, n3, true, false), c3, Wt2) && (u4 = [
        e3,
        t3,
        n3
      ]);
    }), u4 !== null) {
      let [e3, t3, n3] = u4;
      return o3.get(e3, t3, n3).clone();
    }
    let d5 = document.createElement("canvas");
    d5.width = this.resolution, d5.height = this.resolution;
    let f4 = new C4(d5);
    return f4.colorSpace = Ce2, f4.generateMipmaps = false, s3.setTarget(f4, c3), s3.clear(16777215, 0), Et2(c3, i3, l3, (e3, t3, n3) => {
      let r3 = l3.getTileBounds(e3, t3, n3, true, false), i4 = o3.get(e3, t3, n3);
      s3.draw(i4, r3);
    }), f4;
  }
  disposeItem(e2, [t2, n2, r2, i3, a3]) {
    e2 && e2.dispose(), this._markImages([
      t2,
      n2,
      r2,
      i3
    ], a3, true);
  }
  dispose() {
    super.dispose(), this.tiledImageSource.dispose();
  }
  _markImages(e2, t2, n2 = false) {
    let r2 = this.tiledImageSource, i3 = r2.tiling, a3 = [];
    Et2(e2, t2, i3, (e3, t3, i4) => {
      n2 ? r2.release(e3, t3, i4) : a3.push(r2.lock(e3, t3, i4));
    });
    let o3 = a3.filter((e3) => e3 instanceof Promise);
    return o3.length === 0 ? null : Promise.all(o3);
  }
};
var Jt2 = Object.freeze({
  fill: "#cccccc",
  stroke: "transparent",
  strokeWidth: 1,
  radius: 2,
  order: 0,
  visible: true
});
var Yt2 = class {
  static get DEFAULT_STYLE() {
    return Jt2;
  }
  get fill() {
    return this._ctx.fillStyle;
  }
  set fill(e2) {
    this._ctx.fillStyle = e2;
  }
  get stroke() {
    return this._ctx.strokeStyle;
  }
  set stroke(e2) {
    this._ctx.strokeStyle = e2;
  }
  get strokeWidth() {
    return this._ctx.lineWidth;
  }
  set strokeWidth(e2) {
    this._ctx.lineWidth = e2;
  }
  constructor(e2 = {}) {
    let { getX: t2 = (e3) => e3.x, getY: n2 = (e3) => e3.y, flipY: r2 = false, tileExtent: i3 = null } = e2;
    this.getX = t2, this.getY = n2, this.flipY = r2, this.tileExtent = i3, this.radius = Jt2.radius, this.visible = true, this._invScale = 1, this._ctx = null, this._originX = 0, this._originY = 0;
  }
  setFrame(e2, t2, n2) {
    e2.restore();
    let [r2, i3, a3, o3] = t2, [s3, c3, l3, u4] = n2, { width: d5, height: f4 } = e2.canvas, { flipY: p4, tileExtent: m4 } = this, h5 = m4 ?? a3 - r2, g5 = m4 ?? o3 - i3, _6 = Math.round(d5 * (r2 - s3) / (l3 - s3)), v6 = Math.round(d5 * (a3 - s3) / (l3 - s3)), y6 = Math.round(f4 * (u4 - o3) / (u4 - c3)), b6 = Math.round(f4 * (u4 - i3) / (u4 - c3)), x6 = (v6 - _6) / h5, S5 = (p4 ? -1 : 1) * (b6 - y6) / g5, C5 = m4 ? 0 : r2, w5 = m4 ? 0 : p4 ? o3 : i3, T6 = p4 && !m4 ? -g5 : 0;
    e2.save(), e2.setTransform(x6, 0, 0, S5, _6, y6), e2.beginPath(), e2.rect(0, T6, h5, g5), e2.clip(), e2.clearRect(0, T6, h5, g5), this._ctx = e2, this._invScale = 1 / x6, this._originX = C5, this._originY = w5;
  }
  setStyle(e2) {
    let { _invScale: t2 } = this;
    this.fill = e2?.fill ?? Jt2.fill, this.stroke = e2?.stroke ?? Jt2.stroke, this.strokeWidth = (e2?.strokeWidth ?? Jt2.strokeWidth) * t2, this.radius = (e2?.radius ?? Jt2.radius) * t2, this.visible = e2 ? e2?.visible ?? Jt2.visible : false;
  }
  _renderPoints(e2, t2 = 1) {
    let { _ctx: n2, radius: r2, getX: i3, getY: a3, visible: o3, _originX: s3, _originY: c3 } = this;
    if (o3) {
      for (let o4 of e2) for (let e3 of o4) {
        let o5 = i3(e3) - s3, l3 = a3(e3) - c3;
        n2.beginPath(), n2.ellipse(o5, l3, r2 / t2, r2, 0, 0, Math.PI * 2), n2.fill();
      }
      n2.stroke();
    }
  }
  _renderLines(e2) {
    let { _ctx: t2, getX: n2, getY: r2, visible: i3, _originX: a3, _originY: o3 } = this;
    if (i3) {
      if (e2 instanceof Path2D) {
        t2.stroke(e2);
        return;
      }
      t2.beginPath();
      for (let i4 of e2) for (let e3 = 0; e3 < i4.length; e3++) e3 === 0 ? t2.moveTo(n2(i4[e3]) - a3, r2(i4[e3]) - o3) : t2.lineTo(n2(i4[e3]) - a3, r2(i4[e3]) - o3);
      t2.stroke();
    }
  }
  _renderPolygons(e2) {
    let { _ctx: t2, getX: n2, getY: r2, visible: i3, _originX: a3, _originY: o3 } = this;
    if (i3) {
      if (e2 instanceof Path2D) {
        t2.fill(e2, "evenodd"), t2.stroke(e2);
        return;
      }
      t2.beginPath();
      for (let i4 of e2) {
        for (let e3 = 0; e3 < i4.length; e3++) e3 === 0 ? t2.moveTo(n2(i4[e3]) - a3, r2(i4[e3]) - o3) : t2.lineTo(n2(i4[e3]) - a3, r2(i4[e3]) - o3);
        t2.closePath();
      }
      t2.fill("evenodd"), t2.stroke();
    }
  }
};
var Xt2 = /* @__PURE__ */ new Set([
  "Point",
  "MultiPoint",
  "LineString",
  "MultiLineString",
  "Polygon",
  "MultiPolygon"
]);
var Zt2 = /* @__PURE__ */ new L4();
var Qt2 = /* @__PURE__ */ new L4();
function $t2(e2, t2, n2) {
  let r2 = 0.01;
  e2.getCartographicToPosition(t2, n2, 0, Zt2), e2.getCartographicToPosition(t2 + r2, n2, 0, Qt2);
  let i3 = Zt2.distanceTo(Qt2);
  return e2.getCartographicToPosition(t2, n2 + r2, 0, Qt2), Zt2.distanceTo(Qt2) / i3;
}
var en2 = class extends Kt2 {
  constructor({ geojson: e2 = null, url: t2 = null, resolution: n2 = 256, pointRadius: r2 = 6, strokeStyle: i3 = "white", strokeWidth: a3 = 2, fillStyle: o3 = "rgba( 255, 255, 255, 0.5 )", getStyle: s3 = (e3, t3) => ({
    fill: t3.fillStyle || this.fillStyle,
    stroke: t3.strokeStyle || this.strokeStyle,
    strokeWidth: t3.strokeWidth || this.strokeWidth,
    radius: t3.pointRadius || this.pointRadius
  }), ...c3 } = {}) {
    super(c3), this.geojson = e2, this.url = t2, this.resolution = n2, this.pointRadius = r2, this.strokeStyle = i3, this.strokeWidth = a3, this.fillStyle = o3, this.getStyle = s3, this.features = null, this.featureBounds = /* @__PURE__ */ new Map(), this.contentBounds = null, this.projection = new R5(), this.fetchData = (...e3) => fetch(...e3), this._canvasRenderer = new Yt2({
      flipY: true,
      getX: (e3) => e3[0],
      getY: (e3) => e3[1]
    });
  }
  async init() {
    let { geojson: e2, url: t2 } = this;
    if (!e2 && t2) {
      let e3 = await this.fetchData(t2);
      this.geojson = await e3.json();
    }
    this._updateCache(true);
  }
  hasContent(e2, t2, n2, r2) {
    let { projection: i3 } = this, a3 = i3.fromNormalizedToCartographicRange([
      e2,
      t2,
      n2,
      r2
    ]).map((e3) => e3 * N4.RAD2DEG);
    return this._boundsIntersectBounds(a3, this.contentBounds);
  }
  fetchItem(e2, t2) {
    let n2 = document.createElement("canvas"), r2 = new C4(n2);
    return r2.colorSpace = Ce2, r2.generateMipmaps = false, this._drawToCanvas(n2, e2), r2.needsUpdate = true, r2;
  }
  disposeItem(e2) {
    e2 && e2.dispose();
  }
  redraw(...e2) {
    let t2 = this.get(...e2);
    t2 && (this._drawToCanvas(t2.image, e2), t2.needsUpdate = true);
  }
  _updateCache(e2 = false) {
    let { geojson: t2, featureBounds: n2 } = this;
    if (!t2 || this.features && !e2) return;
    n2.clear();
    let r2 = Infinity, i3 = Infinity, a3 = -Infinity, o3 = -Infinity;
    this.features = this._featuresFromGeoJSON(t2);
    for (let e3 of this.features) {
      let t3 = this._getFeatureBounds(e3);
      n2.set(e3, t3);
      let [s3, c3, l3, u4] = t3;
      r2 = Math.min(r2, s3), i3 = Math.min(i3, c3), a3 = Math.max(a3, l3), o3 = Math.max(o3, u4);
    }
    this.contentBounds = [
      r2,
      i3,
      a3,
      o3
    ];
  }
  _drawToCanvas(e2, t2) {
    this._updateCache();
    let [n2, r2, i3, a3] = t2, { projection: o3, resolution: s3, features: c3, _canvasRenderer: l3 } = this;
    e2.width = s3, e2.height = s3;
    let [u4, d5, f4, p4] = o3.fromNormalizedToCartographicRange([
      n2,
      r2,
      i3,
      a3
    ]), m4 = [
      u4 * N4.RAD2DEG,
      d5 * N4.RAD2DEG,
      f4 * N4.RAD2DEG,
      p4 * N4.RAD2DEG
    ], h5 = e2.getContext("2d");
    l3.setFrame(h5, m4, m4);
    for (let e3 of c3) this._featureIntersectsTile(e3, m4) && this._drawFeatureOnCanvas(e3, m4, s3);
  }
  _featureIntersectsTile(e2, t2) {
    let n2 = this.featureBounds.get(e2);
    return n2 ? this._boundsIntersectBounds(n2, t2) : false;
  }
  _boundsIntersectBounds(e2, t2) {
    let [n2, r2, i3, a3] = e2, [o3, s3, c3, l3] = t2;
    return !(i3 < o3 || n2 > c3 || a3 < s3 || r2 > l3);
  }
  _getFeatureBounds(e2) {
    let { geometry: t2 } = e2;
    if (!t2) return null;
    let { type: n2, coordinates: r2 } = t2, i3 = Infinity, a3 = Infinity, o3 = -Infinity, s3 = -Infinity, c3 = (e3, t3) => {
      i3 = Math.min(i3, e3), o3 = Math.max(o3, e3), a3 = Math.min(a3, t3), s3 = Math.max(s3, t3);
    };
    return n2 === "Point" ? c3(r2[0], r2[1]) : n2 === "MultiPoint" || n2 === "LineString" ? r2.forEach((e3) => c3(e3[0], e3[1])) : n2 === "MultiLineString" || n2 === "Polygon" ? r2.forEach((e3) => e3.forEach((e4) => c3(e4[0], e4[1]))) : n2 === "MultiPolygon" && r2.forEach((e3) => e3.forEach((e4) => e4.forEach((e5) => c3(e5[0], e5[1])))), [
      i3,
      a3,
      o3,
      s3
    ];
  }
  _featuresFromGeoJSON(e2) {
    let t2 = e2.type;
    return t2 === "FeatureCollection" ? e2.features : t2 === "Feature" ? [e2] : t2 === "GeometryCollection" ? e2.geometries.map((e3) => ({
      type: "Feature",
      geometry: e3,
      properties: {}
    })) : Xt2.has(t2) ? [{
      type: "Feature",
      geometry: e2,
      properties: {}
    }] : [];
  }
  _drawFeatureOnCanvas(e2, t2, n2) {
    let { geometry: r2 = null, properties: i3 = {} } = e2;
    if (!r2) return;
    let [, a3, , o3] = t2, { _canvasRenderer: s3 } = this, l3 = this.getStyle(e2, i3);
    s3.setStyle(l3);
    let u4 = r2.type;
    if (u4 === "Point" || u4 === "MultiPoint") {
      s3.radius = l3.radius * (o3 - a3) / n2;
      let e3 = u4 === "Point" ? [r2.coordinates] : r2.coordinates;
      for (let t3 of e3) {
        let e4 = $t2(Ye, t3[1] * N4.DEG2RAD, t3[0] * N4.DEG2RAD), n3 = [t3];
        s3._renderPoints([n3], e4);
      }
    } else u4 === "LineString" ? s3._renderLines([r2.coordinates]) : u4 === "MultiLineString" ? s3._renderLines(r2.coordinates) : u4 === "Polygon" ? s3._renderPolygons(r2.coordinates) : u4 === "MultiPolygon" && r2.coordinates.forEach((e3) => s3._renderPolygons(e3));
  }
};
var tn2 = class extends St2 {
  constructor(e2 = {}) {
    let { url: t2 = null, layer: n2 = null, styles: r2 = null, contentBoundingBox: i3 = null, version: a3 = "1.3.0", crs: o3 = "EPSG:4326", format: s3 = "image/png", transparent: c3 = false, levels: l3 = 18, tileDimension: u4 = 256, ...d5 } = e2;
    super(d5), this.url = t2, this.layer = n2, this.crs = o3, this.format = s3, this.tileDimension = u4, this.styles = r2, this.version = a3, this.levels = l3, this.transparent = c3, this.contentBoundingBox = i3;
  }
  init() {
    let { tiling: e2, levels: t2, tileDimension: n2, contentBoundingBox: r2 } = this;
    return e2.setProjection(new R5(this.crs)), e2.flipY = true, e2.generateLevels(t2, e2.projection.tileCountX, e2.projection.tileCountY, {
      tilePixelWidth: n2,
      tilePixelHeight: n2
    }), r2 === null ? e2.setContentBounds(...e2.projection.getBounds()) : e2.setContentBounds(...r2), Promise.resolve();
  }
  normalizedToMercatorX(e2) {
    return N4.mapLinear(e2, 0, 1, -20037508342789244e-9, 20037508342789244e-9);
  }
  normalizedToMercatorY(e2) {
    return N4.mapLinear(e2, 0, 1, -20037508342789244e-9, 20037508342789244e-9);
  }
  getUrl(e2, t2, n2) {
    let { tiling: r2, layer: i3, crs: a3, format: o3, tileDimension: s3, styles: c3, version: l3, transparent: u4 } = this, d5 = l3 === "1.1.1" ? "SRS" : "CRS", f4;
    if (a3 === "EPSG:3857") {
      let i4 = r2.getTileBounds(e2, t2, n2, true, false);
      f4 = [
        this.normalizedToMercatorX(i4[0]),
        this.normalizedToMercatorY(i4[1]),
        this.normalizedToMercatorX(i4[2]),
        this.normalizedToMercatorY(i4[3])
      ];
    } else {
      let [i4, o4, s4, c4] = r2.getTileBounds(e2, t2, n2, false, false).map((e3) => e3 * N4.RAD2DEG);
      f4 = a3 === "EPSG:4326" ? l3 === "1.1.1" ? [
        i4,
        o4,
        s4,
        c4
      ] : [
        o4,
        i4,
        c4,
        s4
      ] : [
        i4,
        o4,
        s4,
        c4
      ];
    }
    let p4 = new URLSearchParams({
      SERVICE: "WMS",
      REQUEST: "GetMap",
      VERSION: l3,
      LAYERS: i3,
      [d5]: a3,
      BBOX: f4.join(","),
      WIDTH: s3,
      HEIGHT: s3,
      FORMAT: o3,
      TRANSPARENT: u4 ? "TRUE" : "FALSE"
    });
    return c3 != null && p4.set("STYLES", c3), new URL("?" + p4.toString(), this.url).toString();
  }
};
var nn2 = class extends St2 {
  constructor(e2 = {}) {
    let { url: t2 = null, ...n2 } = e2;
    super(n2), this.url = t2, this.format = null, this.stem = null;
  }
  getUrl(e2, t2, n2) {
    return `${this.stem}_files/${n2}/${e2}_${t2}.${this.format}`;
  }
  init() {
    let { url: e2 } = this;
    return this.fetchData(e2, this.fetchOptions).then((e3) => e3.text()).then((t2) => {
      let n2 = new DOMParser().parseFromString(t2, "text/xml");
      if (n2.querySelector("DisplayRects") || n2.querySelector("Collection")) throw Error("DeepZoomImagesPlugin: DisplayRect and Collection DZI files not supported.");
      let r2 = n2.querySelector("Image"), i3 = r2.querySelector("Size"), a3 = parseInt(i3.getAttribute("Width")), o3 = parseInt(i3.getAttribute("Height")), s3 = parseInt(r2.getAttribute("TileSize")), c3 = parseInt(r2.getAttribute("Overlap")), l3 = r2.getAttribute("Format");
      this.format = l3, this.stem = e2.split(/\.[^.]+$/g)[0];
      let { tiling: u4 } = this, d5 = Math.ceil(Math.log2(Math.max(a3, o3))) + 1;
      u4.flipY = true, u4.pixelOverlap = c3, u4.generateLevels(d5, 1, 1, {
        tilePixelWidth: s3,
        tilePixelHeight: s3,
        pixelWidth: a3,
        pixelHeight: o3
      });
    });
  }
};
var rn2 = /* @__PURE__ */ new P4();
var an2 = /* @__PURE__ */ new L4();
var on2 = /* @__PURE__ */ new L4();
var sn2 = /* @__PURE__ */ new L4();
var H5 = /* @__PURE__ */ new L4();
var cn2 = /* @__PURE__ */ new v5();
var ln2 = Symbol("SPLIT_TILE_DATA");
var un2 = Symbol("SPLIT_HASH");
var dn2 = Symbol("ORIGINAL_REFINE");
var fn2 = /* @__PURE__ */ new c();
fn2.maxJobs = 10, fn2.priorityCallback = (e2, t2) => {
  let n2 = e2.tile, r2 = t2.tile, i3 = n2.internal.renderer, a3 = r2.internal.renderer, s3 = i3.visibleTiles.has(n2);
  return s3 === a3.visibleTiles.has(r2) ? H(n2, r2) : s3 ? 1 : -1;
};
var pn2 = class {
  get enableTileSplitting() {
    return this._enableTileSplitting;
  }
  set enableTileSplitting(e2) {
    this._enableTileSplitting !== e2 && (this._enableTileSplitting = e2, this._markNeedsUpdate());
  }
  constructor(e2 = {}) {
    let { overlays: t2 = [], resolution: n2 = 256, enableTileSplitting: r2 = true } = e2;
    this.name = "IMAGE_OVERLAY_PLUGIN", this.priority = -15, this.resolution = n2, this._enableTileSplitting = r2, this.overlays = [], this.needsUpdate = false, this.tiles = null, this.tileComposer = null, this.tileControllers = /* @__PURE__ */ new Map(), this.overlayInfo = /* @__PURE__ */ new Map(), this.meshParams = /* @__PURE__ */ new WeakMap(), this.pendingTiles = /* @__PURE__ */ new Map(), this.processedTiles = /* @__PURE__ */ new Set(), this.processQueue = null, this._onUpdateAfter = null, this._onTileDownloadStart = null, this._onTileVisibilityChange = null, this._virtualChildResetId = 0, this._bytesUsed = /* @__PURE__ */ new WeakMap(), t2.forEach((e3) => {
      this.addOverlay(e3);
    });
  }
  init(e2) {
    let t2 = new Ut2();
    this.tiles = e2, this.tileComposer = t2, this.processQueue = fn2, e2.forEachLoadedModel((e3, t3) => {
      this._processTileModel(e3, t3, true);
    }), this._onUpdateAfter = async () => {
      let t3 = false;
      if (this.overlayInfo.forEach((e3, n2) => {
        if (!!n2.frame != !!e3.frame || n2.frame && e3.frame && !e3.frame.equals(n2.frame)) {
          let r2 = e3.order;
          this.deleteOverlay(n2), this.addOverlay(n2, r2), t3 = true;
        }
      }), t3) {
        let { processQueue: t4 } = this, n2 = t4.maxJobs, r2 = 0;
        t4.items.forEach((t5) => {
          e2.visibleTiles.has(t5.tile) && r2++;
        }), t4.maxJobs = r2 + t4.currJobs, t4.tryRunJobs(), t4.maxJobs = n2, this.needsUpdate = true;
      }
      if (this.needsUpdate) {
        this.needsUpdate = false;
        let { overlays: t4, overlayInfo: n2 } = this;
        t4.sort((e3, t5) => n2.get(e3).order - n2.get(t5).order), this.processedTiles.forEach((e3) => {
          this._updateLayers(e3);
        }), this.resetVirtualChildren(!this.enableTileSplitting), e2.recalculateBytesUsed(), e2.dispatchEvent({ type: "needs-render" });
      }
    }, this._onTileDownloadStart = ({ tile: e3, url: t3 }) => {
      !/\.json$/i.test(t3) && !/\.subtree/i.test(t3) && (this.processedTiles.add(e3), this._initTileOverlayInfo(e3));
    }, this._onTileVisibilityChange = ({ tile: e3, visible: t3 }) => {
      this.overlayInfo.forEach(({ tileInfo: n2 }, r2) => {
        if (n2.has(e3)) {
          let { range: i3 } = n2.get(e3);
          r2.setRegionVisible(i3, t3, e3);
        }
      });
    }, e2.addEventListener("update-after", this._onUpdateAfter), e2.addEventListener("tile-download-start", this._onTileDownloadStart), e2.addEventListener("tile-visibility-change", this._onTileVisibilityChange), this.overlays.forEach((e3) => {
      this._initOverlay(e3);
    });
  }
  _removeVirtualChildren(e2) {
    if (!(dn2 in e2)) return;
    let { tiles: t2 } = this, { virtualChildCount: n2 } = e2.internal, r2 = e2.children.length, i3 = r2 - n2;
    for (let n3 = i3; n3 < r2; n3++) {
      let r3 = e2.children[n3];
      t2.processNodeQueue.remove(r3), t2.lruCache.remove(r3), r3.parent = null;
    }
    e2.children.length -= n2, e2.internal.virtualChildCount = 0, e2.refine = e2[dn2], delete e2[dn2], delete e2[un2];
  }
  disposeTile(e2) {
    let { overlayInfo: t2, tileControllers: n2, processQueue: r2, pendingTiles: i3, processedTiles: a3 } = this;
    a3.delete(e2), this._removeVirtualChildren(e2), n2.has(e2) && (n2.get(e2).abort(), n2.delete(e2), i3.delete(e2)), t2.forEach(({ tileInfo: t3 }, n3) => {
      if (t3.has(e2)) {
        let { meshInfo: r3, range: i4 } = t3.get(e2);
        i4 !== null && n3.releaseTexture(i4), t3.delete(e2), r3.clear();
      }
    }), r2.removeByFilter((t3) => t3.tile === e2);
  }
  calculateBytesUsed(e2) {
    let { overlayInfo: t2 } = this, n2 = this._bytesUsed, r2 = null;
    return t2.forEach(({ tileInfo: t3 }, n3) => {
      if (t3.has(e2)) {
        let { target: n4 } = t3.get(e2);
        r2 || (r2 = 0), r2 += zt(n4);
      }
    }), r2 === null ? n2.has(e2) ? n2.get(e2) : 0 : (n2.set(e2, r2), r2);
  }
  processTileModel(e2, t2) {
    return this._processTileModel(e2, t2);
  }
  async _processTileModel(e2, t2, n2 = false) {
    let { tileControllers: r2, processedTiles: i3, pendingTiles: a3 } = this;
    r2.set(t2, new AbortController()), n2 || a3.set(t2, e2), i3.add(t2), this._wrapMaterials(e2), this._initTileOverlayInfo(t2), await this._initTileSceneOverlayInfo(e2, t2), this.expandVirtualChildren(e2, t2), this._updateLayers(t2), a3.delete(t2);
  }
  dispose() {
    let { tiles: e2 } = this;
    [...this.overlays].forEach((e3) => {
      this.deleteOverlay(e3);
    }), this.processedTiles.forEach((e3) => {
      this._updateLayers(e3), this.disposeTile(e3);
    }), e2.removeEventListener("update-after", this._onUpdateAfter), e2.removeEventListener("tile-download-start", this._onTileDownloadStart), e2.removeEventListener("tile-visibility-change", this._onTileVisibilityChange), this.resetVirtualChildren(true);
  }
  getAttributions(e2) {
    this.overlays.forEach((t2) => {
      t2.opacity > 0 && t2.getAttributions(e2);
    });
  }
  parseToMesh(e2, t2, n2, r2) {
    if (n2 === "image_overlay_tile_split") return t2[ln2];
  }
  async resetVirtualChildren(e2 = false) {
    this._virtualChildResetId++;
    let t2 = this._virtualChildResetId;
    if (await Promise.all(this.overlays.map((e3) => e3.whenReady())), t2 !== this._virtualChildResetId) return;
    let { tiles: n2 } = this, r2 = [];
    this.processedTiles.forEach((e3) => {
      un2 in e3 && r2.push(e3);
    }), r2.sort((e3, t3) => t3.internal.depth - e3.internal.depth), r2.forEach((t3) => {
      let n3 = t3.engineData.scene.clone();
      n3.updateMatrixWorld(), (e2 || t3[un2] !== this._getSplitVectors(n3, t3).hash) && this._removeVirtualChildren(t3);
    }), e2 || n2.forEachLoadedModel((e3, t3) => {
      this.expandVirtualChildren(e3, t3);
    });
  }
  _getSplitVectors(e2, t2, n2 = on2) {
    let { tiles: r2, overlayInfo: i3 } = this, a3 = new v5();
    a3.setFromObject(e2), a3.getCenter(n2);
    let o3 = [], s3 = [];
    i3.forEach(({ tileInfo: e3 }, i4) => {
      let a4 = e3.get(t2);
      if (a4 && a4.target && i4.shouldSplit(a4.range)) {
        i4.frame ? H5.set(0, 0, 1).transformDirection(i4.frame) : (r2.surface.getPositionToNormal(n2, H5), H5.length() < 1e-6 && H5.set(1, 0, 0));
        let e4 = `${H5.x.toFixed(3)},${H5.y.toFixed(3)},${H5.z.toFixed(3)}_`;
        s3.includes(e4) || s3.push(e4);
        let t3 = an2.set(0, 0, 1);
        Math.abs(H5.dot(t3)) > 0.9999 && t3.set(1, 0, 0);
        let a5 = new L4().crossVectors(H5, t3).normalize(), c4 = new L4().crossVectors(H5, a5).normalize();
        o3.push(a5, c4);
      }
    });
    let c3 = [];
    for (; o3.length !== 0; ) {
      let e3 = o3.pop().clone(), t3 = e3.clone();
      for (let n3 = 0; n3 < o3.length; n3++) {
        let r3 = o3[n3], i4 = e3.dot(r3);
        Math.abs(i4) > Math.cos(Math.PI / 8) && (t3.addScaledVector(r3, Math.sign(i4)), e3.copy(t3).normalize(), o3.splice(n3, 1), n3--);
      }
      c3.push(t3.normalize());
    }
    return {
      directions: c3,
      hash: s3.join("")
    };
  }
  async expandVirtualChildren(e2, t2) {
    let { refine: n2 } = t2, r2 = n2 === "REPLACE" && t2.children.length === 0 || n2 === "ADD", i3 = t2.internal.virtualChildCount !== 0;
    if (this.enableTileSplitting === false || !r2 || i3) return;
    let a3 = e2.clone();
    a3.updateMatrixWorld();
    let { directions: o3, hash: s3 } = this._getSplitVectors(a3, t2, on2);
    if (o3.length === 0) return;
    t2[un2] = s3;
    let c3 = new Lt2();
    c3.attributeList = (e3) => !/^layer_uv_\d+/.test(e3), o3.map((e3) => {
      c3.addSplitOperation((t3, n3, r3, i4, a4, o4) => (Ae2.getInterpolatedAttribute(t3.attributes.position, n3, r3, i4, a4, an2), an2.applyMatrix4(o4).sub(on2).dot(e3)));
    });
    let l3 = [];
    c3.forEachSplitPermutation(() => {
      let e3 = c3.clipObject(a3);
      e3.matrix.premultiply(t2.engineData.transformInverse).decompose(e3.position, e3.quaternion, e3.scale);
      let n3 = [];
      if (e3.traverse((e4) => {
        if (e4.isMesh) {
          let t3 = e4.material.clone();
          e4.material = t3;
          for (let e5 in t3) {
            let n4 = t3[e5];
            if (n4 && n4.isTexture && n4.source.data instanceof ImageBitmap) {
              let r4 = document.createElement("canvas");
              r4.width = n4.image.width, r4.height = n4.image.height;
              let i4 = r4.getContext("2d");
              i4.scale(1, -1), i4.drawImage(n4.source.data, 0, 0, r4.width, -r4.height);
              let a4 = new C4(r4);
              a4.mapping = n4.mapping, a4.wrapS = n4.wrapS, a4.wrapT = n4.wrapT, a4.minFilter = n4.minFilter, a4.magFilter = n4.magFilter, a4.format = n4.format, a4.type = n4.type, a4.anisotropy = n4.anisotropy, a4.colorSpace = n4.colorSpace, a4.generateMipmaps = n4.generateMipmaps, t3[e5] = a4;
            }
          }
          n3.push(e4);
        }
      }), n3.length === 0) return;
      let r3 = {};
      if (t2.boundingVolume.region && (r3.region = Ot2(n3, this.tiles.surface).region), t2.boundingVolume.box || t2.boundingVolume.sphere) {
        cn2.setFromObject(e3, true).getCenter(sn2);
        let t3 = 0;
        e3.traverse((e4) => {
          let n4 = e4.geometry;
          if (n4) {
            let r4 = n4.attributes.position;
            for (let n5 = 0, i4 = r4.count; n5 < i4; n5++) {
              let i5 = an2.fromBufferAttribute(r4, n5).applyMatrix4(e4.matrixWorld).distanceToSquared(sn2);
              t3 = Math.max(t3, i5);
            }
          }
        }), r3.sphere = [...sn2, Math.sqrt(t3)];
      }
      l3.push({
        internal: { isVirtual: true },
        refine: "REPLACE",
        geometricError: t2.geometricError * 0.5,
        boundingVolume: r3,
        content: { uri: "./child.image_overlay_tile_split" },
        children: [],
        [ln2]: e3
      });
    }), t2[dn2] = t2.refine, t2.refine = "REPLACE", t2.children.push(...l3), t2.internal.virtualChildCount += l3.length;
  }
  fetchData(e2, t2) {
    if (/image_overlay_tile_split/.test(e2)) return /* @__PURE__ */ new ArrayBuffer();
  }
  addOverlay(e2, t2 = null) {
    let { tiles: n2, overlays: r2, overlayInfo: i3 } = this;
    t2 === null && (t2 = r2.reduce((e3, t3) => Math.max(e3, i3.get(t3).order + 1), 0));
    let a3 = new AbortController();
    r2.push(e2), i3.set(e2, {
      order: t2,
      uniforms: {},
      tileInfo: /* @__PURE__ */ new Map(),
      controller: a3,
      frame: e2.frame ? e2.frame.clone() : null
    }), n2 !== null && this._initOverlay(e2);
  }
  setOverlayOrder(e2, t2) {
    this.overlays.indexOf(e2) !== -1 && (this.overlayInfo.get(e2).order = t2, this._markNeedsUpdate());
  }
  deleteOverlay(e2) {
    let { overlays: t2, overlayInfo: n2, processQueue: r2, processedTiles: i3, tiles: a3 } = this, o3 = t2.indexOf(e2);
    if (o3 !== -1) {
      let { tileInfo: s3, controller: c3 } = n2.get(e2);
      i3.forEach((t3) => {
        if (!s3.has(t3)) return;
        let { meshInfo: n3, range: r3 } = s3.get(t3);
        r3 !== null && (a3.visibleTiles.has(t3) && e2.setRegionVisible(r3, false), e2.releaseTexture(r3)), s3.delete(t3), n3.clear();
      }), s3.clear(), n2.delete(e2), c3.abort(), r2.removeByFilter((t3) => t3.overlay === e2 && i3.has(t3.tile)), t2.splice(o3, 1), i3.forEach((e3) => {
        this._updateLayers(e3);
      }), this._markNeedsUpdate();
    }
  }
  _initOverlay(e2) {
    let { processedTiles: t2 } = this;
    e2.init().then(() => {
      e2.setResolution(this.resolution);
    });
    let n2 = [];
    t2.forEach(async (t3) => {
      let r2 = t3.engineData.scene;
      this._initTileOverlayInfo(t3, e2);
      let i3 = this._initTileSceneOverlayInfo(r2, t3, e2);
      n2.push(i3), await i3, this._updateLayers(t3);
    }), Promise.all(n2).then(() => {
      this._markNeedsUpdate();
    });
  }
  _wrapMaterials(e2) {
    e2.traverse((e3) => {
      if (e3.material) {
        let t2 = Mt2(e3.material, e3.material.onBeforeCompile);
        this.meshParams.set(e3, t2);
      }
    });
  }
  _initTileOverlayInfo(e2, t2 = this.overlays) {
    if (Array.isArray(t2)) {
      t2.forEach((t3) => this._initTileOverlayInfo(e2, t3));
      return;
    }
    let { overlayInfo: n2 } = this;
    if (n2.get(t2).tileInfo.has(e2)) return;
    let r2 = {
      range: null,
      target: null,
      meshInfo: /* @__PURE__ */ new Map(),
      failed: false
    };
    if (n2.get(t2).tileInfo.set(e2, r2), t2.isReady && !t2.isPlanarProjection) {
      let n3 = e2.boundingVolume.region ?? e2.boundingVolume.cartographicRange;
      if (n3) {
        let [e3, i3, a3, o3] = n3, s3 = [
          e3,
          i3,
          a3,
          o3
        ];
        s3 = t2.projection.clampToBounds(s3), s3 = t2.projection.fromCartographicToNormalizedRange(s3), r2.range = s3, t2.lockTextureSafe(s3);
      }
    }
  }
  async _initTileSceneOverlayInfo(e2, t2, n2 = this.overlays) {
    if (Array.isArray(n2)) return Promise.all(n2.map((n3) => this._initTileSceneOverlayInfo(e2, t2, n3)));
    let { tiles: r2, overlayInfo: i3, tileControllers: a3 } = this, { surface: o3 } = r2, { controller: s3, tileInfo: c3 } = i3.get(n2), l3 = a3.get(t2);
    if (n2.isReady || await n2.whenReady(), s3.signal.aborted || l3.signal.aborted) return;
    let u4 = [];
    e2.updateMatrixWorld(), e2.traverse((e3) => {
      e3.isMesh && u4.push(e3);
    });
    let { aspectRatio: d5, projection: f4 } = n2, p4 = c3.get(t2), m4, h5, g5;
    if (n2.isPlanarProjection) {
      rn2.makeScale(1 / d5, 1, 1).multiply(n2.frame), e2.parent !== null && rn2.multiply(r2.group.matrixWorldInverse);
      let t3;
      ({ range: m4, uvs: h5, heightRange: t3 } = At2(u4, rn2)), g5 = !(t3[0] > 1 || t3[1] < 0);
    } else rn2.identity(), e2.parent !== null && rn2.copy(r2.group.matrixWorldInverse), { range: m4, uvs: h5 } = Ot2(u4, o3, rn2, f4, p4.range), g5 = true;
    p4.range === null && (p4.range = m4, n2.lockTextureSafe(m4)), r2.visibleTiles.has(t2) && n2.setRegionVisible(p4.range, true), g5 && n2.hasContent(m4) && await this._fetchTileOverlayTexture(t2, n2, p4), u4.forEach((e3, t3) => {
      let n3 = new x5(new Float32Array(h5[t3]), 3);
      p4.meshInfo.set(e3, { attribute: n3 });
    });
  }
  async _fetchTileOverlayTexture(e2, t2, n2) {
    let { tiles: r2, overlayInfo: i3, tileControllers: a3, processQueue: o3 } = this, { controller: s3 } = i3.get(t2), c3 = a3.get(e2), { range: l3 } = n2;
    n2.target = await o3.add({
      tile: e2,
      overlay: t2
    }, async () => {
      if (s3.signal.aborted || c3.signal.aborted) return null;
      let e3 = await t2.getTexture(l3);
      return s3.signal.aborted || c3.signal.aborted ? null : e3;
    }).catch((i4) => i4.name === "AbortError" ? null : (n2.failed = true, r2.dispatchEvent({
      type: "load-error",
      tile: e2,
      overlay: t2,
      error: i4,
      url: null
    }), null));
  }
  resetFailedOverlays() {
    let { processedTiles: e2, overlayInfo: t2, overlays: n2 } = this, r2 = [];
    e2.forEach((e3) => {
      n2.forEach((n3) => {
        let { tileInfo: i3 } = t2.get(n3), a3 = i3.get(e3);
        a3.failed && (a3.failed = false, n3.releaseTexture(a3.range), r2.push({
          tile: e3,
          overlay: n3,
          info: a3
        }));
      });
    }), requestAnimationFrame(() => {
      r2.forEach(({ tile: e3, overlay: t3, info: n3 }) => {
        t3.lockTextureSafe(n3.range), this._fetchTileOverlayTexture(e3, t3, n3).then(() => {
          this._updateLayers(e3);
        }).catch((e4) => {
          if (e4.name !== "AbortError") throw e4;
        });
      });
    });
  }
  _updateLayers(e2) {
    let { overlayInfo: t2, overlays: n2, tileControllers: r2, meshParams: i3 } = this, a3 = r2.get(e2);
    if (this.tiles.recalculateBytesUsed(e2), !(!a3 || a3.signal.aborted)) {
      if (n2.length === 0) {
        let t3 = e2.engineData && e2.engineData.scene;
        t3 && t3.traverse((e3) => {
          if (e3.material && i3.has(e3)) {
            let t4 = i3.get(e3);
            t4.layerMaps.length = 0, t4.layerInfo.length = 0, e3.material.defines.LAYER_COUNT = 0, e3.material.needsUpdate = true;
          }
        });
        return;
      }
      n2.forEach((r3, a4) => {
        let { tileInfo: o3 } = t2.get(r3), { meshInfo: s3, target: c3 } = o3.get(e2);
        s3.forEach(({ attribute: e3 }, t3) => {
          let { geometry: o4, material: s4 } = t3, l3 = i3.get(t3), u4 = `layer_uv_${a4}`;
          o4.getAttribute(u4) !== e3 && (o4.setAttribute(u4, e3), o4.dispose()), l3.layerMaps.length = n2.length, l3.layerInfo.length = n2.length, l3.layerMaps.value[a4] = c3 === null ? null : c3, l3.layerInfo.value[a4] = r3, s4.defines[`LAYER_${a4}_EXISTS`] = Number(c3 !== null), s4.defines[`LAYER_${a4}_ALPHA_INVERT`] = Number(r3.alphaInvert), s4.defines[`LAYER_${a4}_ALPHA_MASK`] = Number(r3.alphaMask), s4.defines.LAYER_COUNT = n2.length, s4.needsUpdate = true;
        });
      });
    }
  }
  _markNeedsUpdate() {
    this.needsUpdate === false && (this.needsUpdate = true, this.tiles !== null && this.tiles.dispatchEvent({ type: "needs-update" }));
  }
};
var mn2 = class {
  get isPlanarProjection() {
    return !!this.frame;
  }
  get downloadQueue() {
    return this._downloadQueue;
  }
  set downloadQueue(e2) {
    if (e2 instanceof c) {
      console.warn('ImageOverlay: "downloadQueue" is no longer valid as a PriorityQueue. Use a DownloadPriorityQueue, instead.');
      return;
    }
    this._downloadQueue = e2;
  }
  constructor(e2 = {}) {
    let { opacity: t2 = 1, color: n2 = 16777215, frame: r2 = null, preprocessURL: i3 = null, alphaMask: o3 = false, alphaInvert: s3 = false } = e2;
    this.preprocessURL = i3, this.opacity = t2, this.color = new w4(n2), this.frame = r2 === null ? null : r2.clone(), this.alphaMask = o3, this.alphaInvert = s3, this.downloadQueue = W, this._whenReady = null, this.isReady = false, this.isInitialized = false, this._visibleRegionCounts = /* @__PURE__ */ new Map();
  }
  init() {
    return this.isInitialized || (this.isInitialized = true, this._whenReady = this._init().then(() => this.isReady = true)), this._whenReady;
  }
  whenReady() {
    return this._whenReady;
  }
  _init() {
    return Promise.resolve();
  }
  fetch(e2, t2 = {}) {
    this.preprocessURL && (e2 = this.preprocessURL(e2));
    let n2 = { priority: -performance.now() };
    return this.downloadQueue.add(e2, n2, () => fetch(e2, t2), t2.signal);
  }
  getAttributions(e2) {
  }
  hasContent(e2, t2 = null) {
    return false;
  }
  async getTexture(e2, t2 = null) {
    return null;
  }
  async lockTexture(e2, t2 = null) {
    return null;
  }
  lockTextureSafe(e2) {
    let t2 = this.lockTexture(e2);
    return t2 instanceof Promise && t2.catch((e3) => {
      if (e3.name !== "AbortError") throw e3;
    }), t2;
  }
  releaseTexture(e2, t2 = null) {
  }
  shouldSplit(e2, t2 = null) {
    return false;
  }
  setResolution(e2) {
  }
  setRegionVisible(e2, t2) {
    let { _visibleRegionCounts: n2 } = this, r2 = e2.join("_"), i3 = n2.get(r2);
    if (i3 || (i3 = {
      range: [...e2],
      count: 0
    }, n2.set(r2, i3)), i3.count += t2 ? 1 : -1, i3.count < 0) throw Error();
    i3.count === 0 && n2.delete(r2);
  }
};
var hn2 = class extends mn2 {
  get tiling() {
    return this.imageSource.tiling;
  }
  get projection() {
    return this.tiling.projection;
  }
  get aspectRatio() {
    return this.tiling && this.isReady ? this.tiling.aspectRatio : 1;
  }
  get fetchOptions() {
    return this.imageSource.fetchOptions;
  }
  set fetchOptions(e2) {
    this.imageSource.fetchOptions = e2;
  }
  constructor(e2 = {}) {
    let { imageSource: t2 = null, ...n2 } = e2;
    super(n2), this.imageSource = t2, this.regionImageSource = null;
  }
  _init() {
    return this._initImageSource().then(() => {
      this.imageSource.fetchData = (...e2) => this.fetch(...e2), this.regionImageSource = new qt2(this.imageSource);
    });
  }
  _initImageSource() {
    return this.imageSource.init();
  }
  calculateLevel(e2, t2 = null) {
    let [n2, r2, i3, a3] = e2, o3 = i3 - n2, s3 = a3 - r2;
    t2 === null && (t2 = this.regionImageSource.resolution);
    let c3 = 0, l3 = this.tiling.maxLevel;
    for (; c3 < l3; c3++) {
      let e3 = t2 / o3, n3 = t2 / s3, r3 = this.tiling.getLevel(c3);
      if (r3 == null) continue;
      let { pixelWidth: i4, pixelHeight: a4 } = r3;
      if (i4 >= e3 || a4 >= n3) break;
    }
    return c3;
  }
  hasContent(e2, t2 = this.calculateLevel(e2)) {
    return this.regionImageSource.hasContent(...e2, t2);
  }
  getTexture(e2, t2 = this.calculateLevel(e2)) {
    return this.regionImageSource.get(...e2, t2);
  }
  lockTexture(e2, t2 = this.calculateLevel(e2)) {
    return this.regionImageSource.lock(...e2, t2);
  }
  releaseTexture(e2, t2 = this.calculateLevel(e2)) {
    this.regionImageSource.release(...e2, t2);
  }
  shouldSplit(e2, t2 = this.calculateLevel(e2)) {
    return this.tiling.maxLevel > t2;
  }
  setResolution(e2) {
    this.regionImageSource.resolution = e2;
  }
};
var gn2 = class extends hn2 {
  constructor(e2 = {}) {
    super(e2), this.imageSource = new Ct2(e2);
  }
};
var _n2 = class extends hn2 {
  constructor(e2) {
    super(e2), this.imageSource = new nn2(e2);
  }
};
var vn2 = class extends mn2 {
  get projection() {
    return this.imageSource.projection;
  }
  get aspectRatio() {
    return 2;
  }
  get pointRadius() {
    return this.imageSource.pointRadius;
  }
  set pointRadius(e2) {
    this.imageSource.pointRadius = e2;
  }
  get strokeStyle() {
    return this.imageSource.strokeStyle;
  }
  set strokeStyle(e2) {
    this.imageSource.strokeStyle = e2;
  }
  get strokeWidth() {
    return this.imageSource.strokeWidth;
  }
  set strokeWidth(e2) {
    this.imageSource.strokeWidth = e2;
  }
  get fillStyle() {
    return this.imageSource.fillStyle;
  }
  set fillStyle(e2) {
    this.imageSource.fillStyle = e2;
  }
  get geojson() {
    return this.imageSource.geojson;
  }
  set geojson(e2) {
    this.imageSource.geojson = e2;
  }
  constructor(e2 = {}) {
    super(e2), this.imageSource = new en2(e2), this._redrawQueue = new c(), this._redrawQueue.maxJobs = 4, this._redrawQueue.priorityCallback = () => 0;
  }
  _init() {
    return this.imageSource.init();
  }
  hasContent(e2) {
    return this.imageSource.hasContent(...e2);
  }
  getTexture(e2) {
    return this.imageSource.get(...e2);
  }
  lockTexture(e2) {
    return this.imageSource.lock(...e2);
  }
  releaseTexture(e2) {
    this.imageSource.release(...e2);
  }
  setResolution(e2) {
    this.imageSource.resolution = e2;
  }
  shouldSplit(e2) {
    return true;
  }
  setRegionVisible(e2, t2) {
    if (super.setRegionVisible(e2, t2), t2) {
      let { _redrawQueue: t3 } = this, n2 = e2.join("_");
      t3.has(n2) && t3.flush(n2);
    }
  }
  redraw() {
    let { imageSource: e2, _redrawQueue: t2, _visibleRegionCounts: n2 } = this;
    for (let { range: t3 } of n2.values()) e2.redraw(...t3);
    e2.forEachItem((r2, i3) => {
      let a3 = i3.join("_");
      !n2.has(a3) && !t2.has(a3) && t2.add(a3, () => {
        e2.redraw(...i3);
      });
    });
  }
};
var yn2 = class extends hn2 {
  constructor(e2 = {}) {
    super(e2), this.imageSource = new tn2(e2);
  }
};
var bn2 = class extends hn2 {
  constructor(e2 = {}) {
    super(e2), this.imageSource = new Ht2(e2);
  }
};
var xn2 = class extends hn2 {
  constructor(e2 = {}) {
    super(e2), this.imageSource = new Tt2(e2);
  }
};
var Sn2 = class extends hn2 {
  constructor(e2 = {}) {
    super(e2);
    let { apiToken: t2, autoRefreshToken: n2, assetId: r2 } = e2;
    this.options = e2, this.assetId = r2, this.auth = new i2({
      apiToken: t2,
      autoRefreshToken: n2
    }), this.auth.authURL = `https://api.cesium.com/v1/assets/${r2}/endpoint`, this._attributions = [], this.externalType = false;
  }
  _initImageSource() {
    return this.auth.refreshToken().then(async (e2) => {
      if (this._attributions = e2.attributions.map((e3) => ({
        value: e3.html,
        type: "html",
        collapsible: e3.collapsible
      })), e2.type !== "IMAGERY") throw Error("CesiumIonOverlay: Only IMAGERY is supported as overlay type.");
      switch (this.externalType = !!e2.externalType, e2.externalType) {
        case "GOOGLE_2D_MAPS": {
          let { url: t2, session: n2, key: r2, tileWidth: i3 } = e2.options, a3 = `${t2}/v1/2dtiles/{z}/{x}/{y}?session=${n2}&key=${r2}`;
          this.imageSource = new Ct2({
            ...this.options,
            url: a3,
            tileDimension: i3,
            levels: 22
          });
          break;
        }
        case "BING": {
          let { url: t2, mapStyle: n2, key: r2 } = e2.options, i3 = `${t2}/REST/v1/Imagery/Metadata/${n2}?incl=ImageryProviders&key=${r2}&uriScheme=https`, a3 = (await fetch(i3).then((e3) => e3.json())).resourceSets[0].resources[0];
          this.imageSource = new wt2({
            ...this.options,
            url: a3.imageUrl,
            subdomains: a3.imageUrlSubdomains,
            tileDimension: a3.tileWidth,
            levels: a3.zoomMax
          });
          break;
        }
        default:
          this.imageSource = new Tt2({
            ...this.options,
            url: e2.url
          });
      }
      return this.imageSource.fetchData = (...e3) => this.fetch(...e3), this.imageSource.init();
    });
  }
  fetch(e2, t2 = {}) {
    if (this.externalType) return super.fetch(e2, t2);
    this.preprocessURL && (e2 = this.preprocessURL(e2));
    let n2 = { priority: -performance.now() };
    return this.downloadQueue.add(e2, n2, () => this.auth.fetch(e2, t2), t2.signal);
  }
  getAttributions(e2) {
    e2.push(...this._attributions);
  }
};
var Cn2 = class extends hn2 {
  constructor(e2 = {}) {
    super(e2);
    let { apiToken: t2, sessionOptions: n2, autoRefreshToken: r2, logoUrl: i3 } = e2;
    this.logoUrl = i3, this.auth = new o2({
      apiToken: t2,
      sessionOptions: n2,
      autoRefreshToken: r2
    }), this.imageSource = new Ct2(), this.imageSource.fetchData = (...e3) => this.fetch(...e3), this._logoAttribution = {
      value: "",
      type: "image",
      collapsible: false
    };
  }
  _initImageSource() {
    return this.auth.refreshToken().then((e2) => (this.imageSource.tileDimension = e2.tileWidth, this.imageSource.url = "https://tile.googleapis.com/v1/2dtiles/{z}/{x}/{y}", this.imageSource.init()));
  }
  fetch(e2, t2 = {}) {
    this.preprocessURL && (e2 = this.preprocessURL(e2));
    let n2 = { priority: -performance.now() };
    return this.downloadQueue.add(e2, n2, () => this.auth.fetch(e2, t2), t2.signal);
  }
  getAttributions(e2) {
    this.logoUrl && (this._logoAttribution.value = this.logoUrl, e2.push(this._logoAttribution));
  }
};
var wn2 = /* @__PURE__ */ new L4();
var Tn2 = /* @__PURE__ */ new Ae2();
var U5 = /* @__PURE__ */ new L4();
var En2 = /* @__PURE__ */ new L4();
var Dn2 = class extends b3 {
  constructor(e2 = D5) {
    super(), this.manager = e2, this.ellipsoid = new Je(), this.skirtLength = 1e3, this.smoothSkirtNormals = true, this.generateNormals = true, this.solid = false, this.minLat = -Math.PI / 2, this.maxLat = Math.PI / 2, this.minLon = -Math.PI, this.maxLon = Math.PI;
  }
  parse(e2) {
    let { ellipsoid: t2, solid: n2, skirtLength: r2, smoothSkirtNormals: i3, generateNormals: a3, minLat: o3, maxLat: s3, minLon: c3, maxLon: l3 } = this, { header: u4, indices: d5, vertexData: f4, edgeIndices: p4, extensions: m4 } = super.parse(e2), h5 = new S4(), g5 = new ue3(), _6 = new ce3(h5, g5);
    _6.position.set(...u4.center);
    let v6 = "octvertexnormals" in m4, y6 = v6 || a3, b6 = f4.u.length, C5 = [], w5 = [], T6 = [], D6 = [], O5 = 0, k5 = 0;
    for (let e3 = 0; e3 < b6; e3++) j5(e3, U5), M6(U5.x, U5.y, U5.z, En2), w5.push(U5.x, U5.y), C5.push(...En2);
    for (let e3 = 0, t3 = d5.length; e3 < t3; e3++) T6.push(d5[e3]);
    if (y6) if (v6) {
      let e3 = m4.octvertexnormals.normals;
      for (let t3 = 0, n3 = e3.length; t3 < n3; t3++) D6.push(e3[t3]);
    } else {
      let e3 = new S4(), t3 = d5.length > 21845 ? new Uint32Array(d5) : new Uint16Array(d5);
      e3.setIndex(new x5(t3, 1, false)), e3.setAttribute("position", new x5(new Float32Array(C5), 3, false)), e3.computeVertexNormals();
      let n3 = e3.getAttribute("normal").array;
      m4.octvertexnormals = { normals: n3 };
      for (let e4 = 0, t4 = n3.length; e4 < t4; e4++) D6.push(n3[e4]);
    }
    if (h5.addGroup(O5, d5.length, k5), O5 += d5.length, k5++, n2) {
      let e3 = C5.length / 3;
      for (let e4 = 0; e4 < b6; e4++) j5(e4, U5), M6(U5.x, U5.y, U5.z, En2, -r2), w5.push(U5.x, U5.y), C5.push(...En2);
      for (let t3 = d5.length - 1; t3 >= 0; t3--) T6.push(d5[t3] + e3);
      if (y6) {
        let e4 = m4.octvertexnormals.normals;
        for (let t3 = 0, n3 = e4.length; t3 < n3; t3++) D6.push(-e4[t3]);
      }
      h5.addGroup(O5, d5.length, k5), O5 += d5.length, k5++;
    }
    if (r2 > 0) {
      let { westIndices: e3, eastIndices: t3, southIndices: n3, northIndices: r3 } = p4, i4, a4 = ee4(e3);
      i4 = C5.length / 3, w5.push(...a4.uv), C5.push(...a4.positions);
      for (let e4 = 0, t4 = a4.indices.length; e4 < t4; e4++) T6.push(a4.indices[e4] + i4);
      let o4 = ee4(t3);
      i4 = C5.length / 3, w5.push(...o4.uv), C5.push(...o4.positions);
      for (let e4 = 0, t4 = o4.indices.length; e4 < t4; e4++) T6.push(o4.indices[e4] + i4);
      let s4 = ee4(n3);
      i4 = C5.length / 3, w5.push(...s4.uv), C5.push(...s4.positions);
      for (let e4 = 0, t4 = s4.indices.length; e4 < t4; e4++) T6.push(s4.indices[e4] + i4);
      let c4 = ee4(r3);
      i4 = C5.length / 3, w5.push(...c4.uv), C5.push(...c4.positions);
      for (let e4 = 0, t4 = c4.indices.length; e4 < t4; e4++) T6.push(c4.indices[e4] + i4);
      y6 && (D6.push(...a4.normals), D6.push(...o4.normals), D6.push(...s4.normals), D6.push(...c4.normals)), h5.addGroup(O5, d5.length, k5), O5 += d5.length, k5++;
    }
    for (let e3 = 0, t3 = C5.length; e3 < t3; e3 += 3) C5[e3 + 0] -= u4.center[0], C5[e3 + 1] -= u4.center[1], C5[e3 + 2] -= u4.center[2];
    let A6 = C5.length / 3 > 65535 ? new Uint32Array(T6) : new Uint16Array(T6);
    if (h5.setIndex(new x5(A6, 1, false)), h5.setAttribute("position", new x5(new Float32Array(C5), 3, false)), h5.setAttribute("uv", new x5(new Float32Array(w5), 2, false)), y6 && h5.setAttribute("normal", new x5(new Float32Array(D6), 3, false)), "watermask" in m4) {
      let { mask: e3, size: t3 } = m4.watermask, n3 = new Uint8Array(2 * t3 * t3);
      for (let t4 = 0, r4 = e3.length; t4 < r4; t4++) {
        let r5 = e3[t4] === 255 ? 0 : 255;
        n3[2 * t4 + 0] = r5, n3[2 * t4 + 1] = r5;
      }
      let r3 = new E4(n3, t3, t3, ye2, je2);
      r3.flipY = true, r3.minFilter = ae2, r3.magFilter = ie4, r3.needsUpdate = true, g5.roughnessMap = r3;
    }
    return _6.userData.minHeight = u4.minHeight, _6.userData.maxHeight = u4.maxHeight, "metadata" in m4 && (_6.userData.metadata = m4.metadata.json), _6;
    function j5(e3, t3) {
      return t3.x = f4.u[e3], t3.y = f4.v[e3], t3.z = f4.height[e3], t3;
    }
    function M6(e3, n3, r3, i4, a4 = 0) {
      let d6 = N4.lerp(u4.minHeight, u4.maxHeight, r3), f5 = N4.lerp(c3, l3, e3), p5 = N4.lerp(o3, s3, n3);
      return t2.getCartographicToPosition(p5, f5, d6 + a4, i4), i4;
    }
    function ee4(e3) {
      let t3 = [], n3 = [], a4 = [], o4 = [], s4 = [];
      for (let i4 = 0, s5 = e3.length; i4 < s5; i4++) j5(e3[i4], U5), t3.push(U5.x, U5.y), a4.push(U5.x, U5.y), M6(U5.x, U5.y, U5.z, En2), n3.push(...En2), M6(U5.x, U5.y, U5.z, En2, -r2), o4.push(...En2);
      let c4 = e3.length - 1;
      for (let t4 = 0; t4 < c4; t4++) {
        let n4 = t4, r3 = t4 + 1, i4 = t4 + e3.length, a5 = t4 + e3.length + 1;
        s4.push(n4, i4, r3), s4.push(r3, i4, a5);
      }
      let l4 = null;
      if (y6) {
        let t4 = (n3.length + o4.length) / 3;
        if (i3) {
          l4 = Array(t4 * 3);
          let n4 = m4.octvertexnormals.normals, r3 = l4.length / 2;
          for (let i4 = 0, a5 = t4 / 2; i4 < a5; i4++) {
            let t5 = e3[i4], a6 = 3 * i4, o5 = n4[3 * t5 + 0], s5 = n4[3 * t5 + 1], c5 = n4[3 * t5 + 2];
            l4[a6 + 0] = o5, l4[a6 + 1] = s5, l4[a6 + 2] = c5, l4[r3 + a6 + 0] = o5, l4[r3 + a6 + 1] = s5, l4[r3 + a6 + 2] = c5;
          }
        } else {
          l4 = [], Tn2.a.fromArray(n3, 0), Tn2.b.fromArray(o4, 0), Tn2.c.fromArray(n3, 3), Tn2.getNormal(wn2);
          for (let e4 = 0; e4 < t4; e4++) l4.push(...wn2);
        }
      }
      return {
        uv: [...t3, ...a4],
        positions: [...n3, ...o4],
        indices: s4,
        normals: l4
      };
    }
  }
};
var On2 = {};
var kn2 = /* @__PURE__ */ new L4();
var An2 = /* @__PURE__ */ new L4();
var jn2 = /* @__PURE__ */ new L4();
var Mn2 = /* @__PURE__ */ new L4();
var Nn2 = /* @__PURE__ */ new L4();
var W3 = /* @__PURE__ */ new L4();
var Pn2 = /* @__PURE__ */ new L4();
var G4 = /* @__PURE__ */ new I4();
var Fn2 = /* @__PURE__ */ new I4();
var In2 = /* @__PURE__ */ new I4();
var Ln2 = class extends Lt2 {
  constructor() {
    super(), this.ellipsoid = new Je(), this.skirtLength = 1e3, this.smoothSkirtNormals = true, this.solid = false, this.minLat = -Math.PI / 2, this.maxLat = Math.PI / 2, this.minLon = -Math.PI, this.maxLon = Math.PI, this.attributeList = [
      "position",
      "normal",
      "uv"
    ];
  }
  clipToQuadrant(e2, t2, n2) {
    let { solid: r2, skirtLength: i3, ellipsoid: a3, smoothSkirtNormals: o3 } = this;
    this.clearSplitOperations(), this.addSplitOperation(Rn2("x"), !t2), this.addSplitOperation(Rn2("y"), !n2);
    let s3, c3, l3 = e2.geometry.groups[0], u4 = this.getClippedData(e2, l3);
    if (this.adjustVertices(u4, e2.position, 0), r2) {
      s3 = {
        index: u4.index.slice().reverse(),
        attributes: {}
      };
      for (let e3 in u4.attributes) s3.attributes[e3] = u4.attributes[e3].slice();
      let t3 = s3.attributes.normal;
      if (t3) for (let e3 = 0; e3 < t3.length; e3 += 3) t3[e3 + 0] *= -1, t3[e3 + 1] *= -1, t3[e3 + 2] *= -1;
      this.adjustVertices(s3, e2.position, -i3);
    }
    if (i3 > 0) {
      c3 = {
        index: [],
        attributes: {
          position: [],
          normal: [],
          uv: []
        }
      };
      let t3 = 0, n3 = {}, r3 = (e3, r4, i4) => {
        let a4 = Vt2(...e3, ...i4, ...r4);
        a4 in n3 || (n3[a4] = t3, t3++, c3.attributes.position.push(...e3), c3.attributes.normal.push(...i4), c3.attributes.uv.push(...r4)), c3.index.push(n3[a4]);
      }, s4 = u4.index, l4 = u4.attributes.uv, d6 = u4.attributes.position, f5 = u4.attributes.normal, p5 = u4.index.length / 3;
      for (let t4 = 0; t4 < p5; t4++) {
        let n4 = 3 * t4;
        for (let t5 = 0; t5 < 3; t5++) {
          let c4 = (t5 + 1) % 3, u5 = s4[n4 + t5], p6 = s4[n4 + c4];
          if (G4.fromArray(l4, u5 * 2), Fn2.fromArray(l4, p6 * 2), G4.x === Fn2.x && (G4.x === 0 || G4.x === 0.5 || G4.x === 1) || G4.y === Fn2.y && (G4.y === 0 || G4.y === 0.5 || G4.y === 1)) {
            An2.fromArray(d6, u5 * 3), jn2.fromArray(d6, p6 * 3);
            let t6 = An2, n5 = jn2, s5 = Mn2.copy(An2), c5 = Nn2.copy(jn2);
            W3.copy(s5).add(e2.position), a3.getPositionToNormal(W3, W3), s5.addScaledVector(W3, -i3), W3.copy(c5).add(e2.position), a3.getPositionToNormal(W3, W3), c5.addScaledVector(W3, -i3), o3 && f5 ? (W3.fromArray(f5, u5 * 3), Pn2.fromArray(f5, p6 * 3)) : (W3.subVectors(t6, n5), Pn2.subVectors(t6, s5).cross(W3).normalize(), W3.copy(Pn2)), r3(n5, Fn2, Pn2), r3(t6, G4, W3), r3(s5, G4, W3), r3(n5, Fn2, Pn2), r3(s5, G4, W3), r3(c5, Fn2, Pn2);
          }
        }
      }
    }
    let d5 = u4.index.length, f4 = u4;
    if (s3) {
      let { index: e3, attributes: t3 } = s3, n3 = f4.attributes.position.length / 3;
      for (let t4 = 0, r3 = e3.length; t4 < r3; t4++) f4.index.push(e3[t4] + n3);
      for (let e4 in u4.attributes) f4.attributes[e4].push(...t3[e4]);
    }
    if (c3) {
      let { index: e3, attributes: t3 } = c3, n3 = f4.attributes.position.length / 3;
      for (let t4 = 0, r3 = e3.length; t4 < r3; t4++) f4.index.push(e3[t4] + n3);
      for (let e4 in u4.attributes) f4.attributes[e4].push(...t3[e4]);
    }
    let p4 = t2 ? 0 : -0.5, m4 = n2 ? 0 : -0.5, h5 = f4.attributes.uv;
    for (let e3 = 0, t3 = h5.length; e3 < t3; e3 += 2) h5[e3] = (h5[e3] + p4) * 2, h5[e3 + 1] = (h5[e3 + 1] + m4) * 2;
    let g5 = this.constructMesh(f4.attributes, f4.index, e2);
    g5.userData.minHeight = e2.userData.minHeight, g5.userData.maxHeight = e2.userData.maxHeight;
    let _6 = 0, v6 = 0;
    return g5.geometry.addGroup(v6, d5, _6), v6 += d5, _6++, s3 && (g5.geometry.addGroup(v6, s3.index.length, _6), v6 += s3.index.length, _6++), c3 && (g5.geometry.addGroup(v6, c3.index.length, _6), v6 += c3.index.length, _6++), g5;
  }
  adjustVertices(e2, t2, n2) {
    let { ellipsoid: r2, minLat: i3, maxLat: a3, minLon: o3, maxLon: s3 } = this, { attributes: c3, vertexIsClipped: l3 } = e2, u4 = c3.position, d5 = c3.uv, f4 = u4.length / 3;
    for (let e3 = 0; e3 < f4; e3++) {
      let c4 = G4.fromArray(d5, e3 * 2);
      l3 && l3[e3] && (Math.abs(c4.x - 0.5) < 1e-10 && (c4.x = 0.5), Math.abs(c4.y - 0.5) < 1e-10 && (c4.y = 0.5), G4.toArray(d5, e3 * 2));
      let f5 = N4.lerp(i3, a3, c4.y), p4 = N4.lerp(o3, s3, c4.x), m4 = kn2.fromArray(u4, e3 * 3).add(t2);
      r2.getPositionToCartographic(m4, On2), r2.getCartographicToPosition(f5, p4, On2.height + n2, m4), m4.sub(t2), m4.toArray(u4, e3 * 3);
    }
  }
};
function Rn2(e2) {
  return (t2, n2, r2, i3, a3) => {
    let o3 = t2.attributes.uv;
    return G4.fromBufferAttribute(o3, n2), Fn2.fromBufferAttribute(o3, r2), In2.fromBufferAttribute(o3, i3), G4[e2] * a3.x + Fn2[e2] * a3.y + In2[e2] * a3.z - 0.5;
  };
}
var zn2 = Symbol("TILE_X");
var Bn2 = Symbol("TILE_Y");
var Vn2 = Symbol("TILE_LEVEL");
var Hn2 = Symbol("TILE_AVAILABLE");
var Un2 = Symbol("TILE_SPLIT_SOURCE_SCENE");
var Wn2 = 1e4;
var Gn2 = /* @__PURE__ */ new L4();
function Kn2(e2, t2, n2, r2) {
  if (e2 && t2 < e2.length) {
    let i3 = e2[t2];
    for (let e3 = 0, t3 = i3.length; e3 < t3; e3++) {
      let { startX: t4, startY: a3, endX: o3, endY: s3 } = i3[e3];
      if (n2 >= t4 && n2 <= o3 && r2 >= a3 && r2 <= s3) return true;
    }
  }
  return false;
}
function qn2(e2) {
  let { available: t2 = null, maxzoom: n2 = null } = e2;
  return n2 === null ? t2.length - 1 : n2;
}
function Jn2(e2) {
  let { metadataAvailability: t2 = -1 } = e2;
  return t2;
}
function Yn2(e2, t2) {
  let n2 = e2[Vn2], r2 = Jn2(t2);
  return n2 < qn2(t2) && r2 !== -1 && n2 % r2 === 0;
}
function Xn(e2, t2, n2, r2, i3) {
  return i3.tiles[0].replace(/{\s*z\s*}/g, n2).replace(/{\s*x\s*}/g, e2).replace(/{\s*y\s*}/g, t2).replace(/{\s*version\s*}/g, r2);
}
var Zn = class {
  constructor(e2 = {}) {
    let { useRecommendedSettings: t2 = true, skirtLength: n2 = null, smoothSkirtNormals: r2 = true, generateNormals: i3 = true, solid: a3 = false } = e2;
    this.name = "QUANTIZED_MESH_PLUGIN", this.priority = -1e3, this.tiles = null, this.layer = null, this.useRecommendedSettings = t2, this.skirtLength = n2, this.smoothSkirtNormals = r2, this.solid = a3, this.generateNormals = i3, this.attribution = null, this.tiling = new it2(), this.projection = new R5();
  }
  init(e2) {
    e2.fetchOptions.headers = e2.fetchOptions.headers || {}, e2.fetchOptions.headers.Accept = "application/vnd.quantized-mesh,application/octet-stream;q=0.9", this.useRecommendedSettings && (e2.errorTarget = 2), this.tiles = e2;
  }
  loadRootTileset() {
    let { tiles: e2 } = this, t2 = new URL("layer.json", new URL(e2.rootURL, location.href));
    return e2.invokeAllPlugins((e3) => t2 = e3.preprocessURL ? e3.preprocessURL(t2, null) : t2), e2.invokeOnePlugin((e3) => e3.fetchData && e3.fetchData(t2, this.tiles.fetchOptions)).then((e3) => e3.json()).then((e3) => {
      this.layer = e3;
      let { projection: t3 = "EPSG:4326", extensions: n2 = [], attribution: r2 = "", available: i3 = null } = e3, { tiling: a3, tiles: o3, projection: s3 } = this;
      r2 && (this.attribution = {
        value: r2,
        type: "string",
        collapsible: true
      }), n2.length > 0 && (o3.fetchOptions.headers.Accept += `;extensions=${n2.join("-")}`), s3.setScheme(t3);
      let { tileCountX: c3, tileCountY: l3 } = s3;
      a3.setProjection(s3), a3.generateLevels(qn2(e3) + 1, c3, l3);
      let u4 = [];
      for (let e4 = 0; e4 < c3; e4++) {
        let t4 = this.createChild(0, e4, 0, i3);
        t4 && u4.push(t4);
      }
      let d5 = {
        asset: { version: "1.1" },
        geometricError: Infinity,
        root: {
          refine: "REPLACE",
          geometricError: Infinity,
          boundingVolume: { region: [
            ...this.tiling.getContentBounds(),
            -1e4,
            Wn2
          ] },
          children: u4,
          [Hn2]: i3,
          [Vn2]: -1
        }
      }, f4 = o3.rootURL;
      return o3.invokeAllPlugins((e4) => f4 = e4.preprocessURL ? e4.preprocessURL(f4, null) : f4), o3.preprocessTileset(d5, f4), d5;
    });
  }
  parseToMesh(e2, t2, n2, r2) {
    let { skirtLength: i3, solid: a3, smoothSkirtNormals: o3, generateNormals: s3, tiles: c3 } = this, l3 = c3.ellipsoid, u4;
    if (n2 === "quantized_tile_split") {
      let e3 = new URL(r2).searchParams, n3 = e3.get("left") === "true", s4 = e3.get("bottom") === "true", c4 = new Ln2();
      c4.ellipsoid.copy(l3), c4.solid = a3, c4.smoothSkirtNormals = o3, c4.skirtLength = i3 === null ? t2.geometricError : i3;
      let [d6, f5, p5, m4] = t2.parent.boundingVolume.region;
      c4.minLat = f5, c4.maxLat = m4, c4.minLon = d6, c4.maxLon = p5;
      let h5 = t2.parent.engineData.scene || t2.parent[Un2];
      u4 = c4.clipToQuadrant(h5, n3, s4);
    } else if (n2 === "terrain") {
      let n3 = new Dn2(c3.manager);
      n3.ellipsoid.copy(l3), n3.solid = a3, n3.smoothSkirtNormals = o3, n3.generateNormals = s3, n3.skirtLength = i3 === null ? t2.geometricError : i3;
      let [r3, d6, f5, p5] = t2.boundingVolume.region;
      n3.minLat = d6, n3.maxLat = p5, n3.minLon = r3, n3.maxLon = f5, u4 = n3.parse(e2);
    } else return;
    let { minHeight: d5, maxHeight: f4, metadata: p4 } = u4.userData;
    return t2.boundingVolume.region[4] = d5, t2.boundingVolume.region[5] = f4, t2.engineData.boundingVolume.setRegionData(l3, ...t2.boundingVolume.region), p4 && ("geometricerror" in p4 && (t2.geometricError = p4.geometricerror), Yn2(t2, this.layer) && "available" in p4 && t2.children.length === 0 && (t2[Hn2] = [...Array(t2[Vn2] + 1).fill(null), ...p4.available])), t2[Un2] = u4, this.expandChildren(t2), u4;
  }
  getAttributions(e2) {
    this.attribution && e2.push(this.attribution);
  }
  createChild(e2, t2, n2, r2) {
    let { tiles: i3, layer: a3, tiling: o3, projection: s3 } = this, c3 = i3.ellipsoid, l3 = r2 === null && e2 === 0 || Kn2(r2, e2, t2, n2), u4 = Xn(t2, n2, e2, 1, a3), d5 = [
      ...o3.getTileBounds(t2, n2, e2),
      -1e4,
      Wn2
    ], [, f4, , p4, , m4] = d5, h5 = f4 > 0 == p4 > 0 ? Math.min(Math.abs(f4), Math.abs(p4)) : 0;
    c3.getCartographicToPosition(h5, 0, m4, Gn2), Gn2.z = 0;
    let g5 = s3.tileCountX, _6 = Math.max(...c3.radius) * 2 * Math.PI * 0.25 / (65 * g5) / 2 ** e2, v6 = {
      [Hn2]: null,
      [Vn2]: e2,
      [zn2]: t2,
      [Bn2]: n2,
      refine: "REPLACE",
      geometricError: _6,
      boundingVolume: { region: d5 },
      content: l3 ? { uri: u4 } : null,
      children: []
    };
    return Yn2(v6, a3) || (v6[Hn2] = r2), v6;
  }
  expandChildren(e2) {
    let t2 = e2[Vn2], n2 = e2[zn2], r2 = e2[Bn2], i3 = e2[Hn2];
    if (t2 >= this.tiling.maxLevel) return;
    let a3 = false;
    for (let o3 = 0; o3 < 2; o3++) for (let s3 = 0; s3 < 2; s3++) {
      let c3 = this.createChild(t2 + 1, 2 * n2 + o3, 2 * r2 + s3, i3);
      c3.content === null ? (c3.content = { uri: `tile.quantized_tile_split?bottom=${s3 === 0}&left=${o3 === 0}` }, c3.internal = { isVirtual: true }, e2.internal.virtualChildCount++, e2.children.push(c3)) : (e2.children.push(c3), a3 = true);
    }
    a3 || (e2.children.length -= e2.internal.virtualChildCount, e2.internal.virtualChildCount = 0);
  }
  fetchData(e2, t2) {
    if (/quantized_tile_split/.test(e2)) return /* @__PURE__ */ new ArrayBuffer();
  }
  disposeTile(e2) {
    let { tiles: t2, layer: n2 } = this;
    if (delete e2[Un2], Yn2(e2, n2) && (e2[Hn2] = null), Hn2 in e2) {
      let { virtualChildCount: n3 } = e2.internal, r2 = e2.children.length, i3 = r2 - n3;
      for (let n4 = i3; n4 < r2; n4++) t2.processNodeQueue.remove(e2.children[n4]);
      e2.children.length = 0, e2.internal.virtualChildCount = 0;
    }
  }
};
var $n = /* @__PURE__ */ new P4();
var er = class {
  constructor() {
    this.name = "UPDATE_ON_CHANGE_PLUGIN", this.tiles = null, this.needsUpdate = false, this.cameraMatrices = /* @__PURE__ */ new Map();
  }
  init(e2) {
    this.tiles = e2, this._needsUpdateCallback = () => {
      this.needsUpdate = true;
    }, this._onCameraAdd = ({ camera: e3 }) => {
      this.needsUpdate = true, this.cameraMatrices.set(e3, new P4());
    }, this._onCameraDelete = ({ camera: e3 }) => {
      this.needsUpdate = true, this.cameraMatrices.delete(e3);
    }, e2.addEventListener("needs-update", this._needsUpdateCallback), e2.addEventListener("add-camera", this._onCameraAdd), e2.addEventListener("delete-camera", this._onCameraDelete), e2.addEventListener("camera-resolution-change", this._needsUpdateCallback), e2.cameras.forEach((e3) => {
      this._onCameraAdd({ camera: e3 });
    });
  }
  doTilesNeedUpdate() {
    let e2 = this.tiles, t2 = false;
    this.cameraMatrices.forEach((n3, r2) => {
      $n.copy(e2.group.matrixWorld).premultiply(r2.matrixWorldInverse).premultiply(r2.projectionMatrixInverse), t2 || (t2 = !$n.equals(n3)), n3.copy($n);
    });
    let n2 = this.needsUpdate;
    return this.needsUpdate = false, n2 || t2;
  }
  preprocessNode() {
    this.needsUpdate = true;
  }
  dispose() {
    let e2 = this.tiles;
    e2.removeEventListener("camera-resolution-change", this._needsUpdateCallback), e2.removeEventListener("needs-update", this._needsUpdateCallback), e2.removeEventListener("add-camera", this._onCameraAdd), e2.removeEventListener("delete-camera", this._onCameraDelete);
  }
};
var tr = /* @__PURE__ */ new L4();
function nr(e2, t2) {
  if (e2.isInterleavedBufferAttribute || e2.array instanceof t2) return e2;
  let n2 = t2 === Int8Array || t2 === Int16Array || t2 === Int32Array ? -1 : 0, r2 = new x5(new t2(e2.count * e2.itemSize), e2.itemSize, true), i3 = e2.itemSize, a3 = e2.count;
  for (let t3 = 0; t3 < a3; t3++) for (let a4 = 0; a4 < i3; a4++) {
    let i4 = N4.clamp(e2.getComponent(t3, a4), n2, 1);
    r2.setComponent(t3, a4, i4);
  }
  return r2;
}
function rr(e2, t2 = Int16Array) {
  let n2 = e2.geometry, r2 = n2.attributes, i3 = r2.position;
  if (i3.isInterleavedBufferAttribute || i3.array instanceof t2) return i3;
  let a3 = new x5(new t2(i3.count * i3.itemSize), i3.itemSize, false), o3 = i3.itemSize, s3 = i3.count;
  n2.computeBoundingBox();
  let c3 = n2.boundingBox, { min: l3, max: u4 } = c3, d5 = 2 ** (8 * t2.BYTES_PER_ELEMENT - 1) - 1, f4 = -d5;
  for (let e3 = 0; e3 < s3; e3++) for (let t3 = 0; t3 < o3; t3++) {
    let n3 = t3 === 0 ? "x" : t3 === 1 ? "y" : "z", r3 = l3[n3], o4 = u4[n3], s4 = N4.mapLinear(i3.getComponent(e3, t3), r3, o4, f4, d5);
    a3.setComponent(e3, t3, s4);
  }
  c3.getCenter(tr).multiply(e2.scale).applyQuaternion(e2.quaternion), e2.position.add(tr), e2.scale.x *= 0.5 * (u4.x - l3.x) / d5, e2.scale.y *= 0.5 * (u4.y - l3.y) / d5, e2.scale.z *= 0.5 * (u4.z - l3.z) / d5, r2.position = a3, e2.geometry.boundingBox = null, e2.geometry.boundingSphere = null, e2.updateMatrixWorld();
}
var ir = class {
  constructor(e2) {
    this._options = {
      generateNormals: false,
      disableMipmaps: true,
      compressIndex: true,
      compressNormals: false,
      compressUvs: false,
      compressPosition: false,
      uvType: Int8Array,
      normalType: Int8Array,
      positionType: Int16Array,
      ...e2
    }, this.name = "TILES_COMPRESSION_PLUGIN", this.priority = -100;
  }
  processTileModel(e2, t2) {
    let { generateNormals: n2, disableMipmaps: r2, compressIndex: i3, compressUvs: a3, compressNormals: o3, compressPosition: s3, uvType: c3, normalType: l3, positionType: u4 } = this._options;
    e2.traverse((e3) => {
      if (e3.material && r2) {
        let t3 = e3.material;
        for (let e4 in t3) {
          let n3 = t3[e4];
          n3 && n3.isTexture && n3.generateMipmaps && (n3.generateMipmaps = false, n3.minFilter = ie4);
        }
      }
      if (e3.geometry) {
        let t3 = e3.geometry, r3 = t3.attributes;
        if (a3) {
          let { uv: e4, uv1: t4, uv2: n3, uv3: i4 } = r3;
          e4 && (r3.uv = nr(e4, c3)), t4 && (r3.uv1 = nr(t4, c3)), n3 && (r3.uv2 = nr(n3, c3)), i4 && (r3.uv3 = nr(i4, c3));
        }
        if (n2 && !r3.normals && t3.computeVertexNormals(), o3 && r3.normals && (r3.normals = nr(r3.normals, l3)), s3 && rr(e3, u4), i3 && t3.index) {
          let e4 = r3.position.count, n3 = t3.index, i4 = e4 > 65535 ? Uint32Array : e4 > 255 ? Uint16Array : Uint8Array;
          if (!(n3.array instanceof i4)) {
            let e5 = new i4(t3.index.count);
            e5.set(n3.array);
            let r4 = new x5(e5, 1);
            t3.setIndex(r4);
          }
        }
      }
    });
  }
};
function K3(e2, t2, n2) {
  return e2 && t2 in e2 ? e2[t2] : n2;
}
function ar(e2) {
  return e2 !== "BOOLEAN" && e2 !== "STRING" && e2 !== "ENUM";
}
function or(e2) {
  return /^FLOAT/.test(e2);
}
function sr(e2) {
  return /^VEC/.test(e2);
}
function cr(e2) {
  return /^MAT/.test(e2);
}
function lr(e2, t2, n2, r2 = null) {
  return cr(n2) || sr(n2) ? r2.fromArray(e2, t2) : e2[t2];
}
function ur(e2) {
  let { type: t2, componentType: n2 } = e2;
  switch (t2) {
    case "SCALAR":
      return n2 === "INT64" ? 0n : 0;
    case "VEC2":
      return new I4();
    case "VEC3":
      return new L4();
    case "VEC4":
      return new Me2();
    case "MAT2":
      return new oe3();
    case "MAT3":
      return new se3();
    case "MAT4":
      return new P4();
    case "BOOLEAN":
      return false;
    case "STRING":
      return "";
    case "ENUM":
      return 0;
  }
}
function dr(e2, t2) {
  if (t2 == null) return false;
  switch (e2) {
    case "SCALAR":
      return typeof t2 == "number" || typeof t2 == "bigint";
    case "VEC2":
      return t2.isVector2;
    case "VEC3":
      return t2.isVector3;
    case "VEC4":
      return t2.isVector4;
    case "MAT2":
      return t2.isMatrix2;
    case "MAT3":
      return t2.isMatrix3;
    case "MAT4":
      return t2.isMatrix4;
    case "BOOLEAN":
      return typeof t2 == "boolean";
    case "STRING":
      return typeof t2 == "string";
    case "ENUM":
      return typeof t2 == "number" || typeof t2 == "bigint";
  }
  throw Error("ClassProperty: invalid type.");
}
function fr(e2, t2 = null) {
  switch (e2) {
    case "INT8":
      return Int8Array;
    case "INT16":
      return Int16Array;
    case "INT32":
      return Int32Array;
    case "INT64":
      return BigInt64Array;
    case "UINT8":
      return Uint8Array;
    case "UINT16":
      return Uint16Array;
    case "UINT32":
      return Uint32Array;
    case "UINT64":
      return BigUint64Array;
    case "FLOAT32":
      return Float32Array;
    case "FLOAT64":
      return Float64Array;
  }
  switch (t2) {
    case "BOOLEAN":
      return Uint8Array;
    case "STRING":
      return Uint8Array;
  }
  throw Error("ClassProperty: invalid type.");
}
function pr(e2, t2 = null) {
  if (e2.array) {
    t2 = t2 && Array.isArray(t2) ? t2 : [], t2.length = e2.count;
    for (let n2 = 0, r2 = t2.length; n2 < r2; n2++) t2[n2] = mr(e2, t2[n2]);
  } else t2 = mr(e2, t2);
  return t2;
}
function mr(e2, t2 = null) {
  let n2 = e2.default, r2 = e2.type;
  if (t2 || (t2 = ur(e2)), n2 === null) {
    switch (r2) {
      case "SCALAR":
        return 0;
      case "VEC2":
        return t2.set(0, 0);
      case "VEC3":
        return t2.set(0, 0, 0);
      case "VEC4":
        return t2.set(0, 0, 0, 0);
      case "MAT2":
        return t2.identity();
      case "MAT3":
        return t2.identity();
      case "MAT4":
        return t2.identity();
      case "BOOLEAN":
        return false;
      case "STRING":
        return "";
      case "ENUM":
        return "";
    }
    throw Error("ClassProperty: invalid type.");
  } else if (cr(r2)) t2.fromArray(n2);
  else if (sr(r2)) t2.fromArray(n2);
  else return n2;
}
function hr(e2, t2) {
  if (e2.noData === null) return t2;
  let n2 = e2.noData, r2 = e2.type;
  if (Array.isArray(t2)) for (let e3 = 0, n3 = t2.length; e3 < n3; e3++) t2[e3] = i3(t2[e3]);
  else t2 = i3(t2);
  return t2;
  function i3(t3) {
    return a3(t3) && (t3 = mr(e2, t3)), t3;
  }
  function a3(e3) {
    if (cr(r2)) {
      let t3 = e3.elements;
      for (let e4 = 0, r3 = n2.length; e4 < r3; e4++) if (n2[e4] !== t3[e4]) return false;
      return true;
    } else if (sr(r2)) {
      for (let t3 = 0, r3 = n2.length; t3 < r3; t3++) if (n2[t3] !== e3.getComponent(t3)) return false;
      return true;
    } else return n2 === e3;
  }
}
function gr(e2, t2) {
  switch (e2) {
    case "INT8":
      return Math.max(t2 / 127, -1);
    case "INT16":
      return Math.max(t2, 32767, -1);
    case "INT32":
      return Math.max(t2 / 2147483647, -1);
    case "INT64":
      return Math.max(Number(t2) / 9223372036854776e3, -1);
    case "UINT8":
      return t2 / 255;
    case "UINT16":
      return t2 / 65535;
    case "UINT32":
      return t2 / 4294967295;
    case "UINT64":
      return Number(t2) / 18446744073709552e3;
  }
}
function _r(e2, t2) {
  let { type: n2, componentType: r2, scale: i3, offset: a3, normalized: o3 } = e2;
  if (Array.isArray(t2)) for (let e3 = 0, n3 = t2.length; e3 < n3; e3++) t2[e3] = s3(t2[e3]);
  else t2 = s3(t2);
  return t2;
  function s3(e3) {
    return e3 = cr(n2) ? l3(e3) : sr(n2) ? c3(e3) : u4(e3), e3;
  }
  function c3(e3) {
    return e3.x = u4(e3.x), e3.y = u4(e3.y), "z" in e3 && (e3.z = u4(e3.z)), "w" in e3 && (e3.w = u4(e3.w)), e3;
  }
  function l3(e3) {
    let t3 = e3.elements;
    for (let e4 = 0, n3 = t3.length; e4 < n3; e4++) t3[e4] = u4(t3[e4]);
    return e3;
  }
  function u4(e3) {
    return o3 && (e3 = gr(r2, e3)), (o3 || or(r2)) && (e3 = e3 * i3 + a3), e3;
  }
}
function vr(e2, t2, n2 = null) {
  if (e2.array) {
    Array.isArray(t2) || (t2 = Array(e2.count || 0)), t2.length = n2 === null ? e2.count : n2;
    for (let n3 = 0, r2 = t2.length; n3 < r2; n3++) dr(e2.type, t2[n3]) || (t2[n3] = ur(e2));
  } else dr(e2.type, t2) || (t2 = ur(e2));
  return t2;
}
function yr(e2, t2) {
  for (let n2 in t2) n2 in e2 || delete t2[n2];
  for (let n2 in e2) {
    let r2 = e2[n2];
    t2[n2] = vr(r2, t2[n2]);
  }
}
function br(e2) {
  switch (e2) {
    case "ENUM":
      return 1;
    case "SCALAR":
      return 1;
    case "VEC2":
      return 2;
    case "VEC3":
      return 3;
    case "VEC4":
      return 4;
    case "MAT2":
      return 4;
    case "MAT3":
      return 9;
    case "MAT4":
      return 16;
    case "BOOLEAN":
      return -1;
    case "STRING":
      return -1;
    default:
      return -1;
  }
}
var xr = class {
  constructor(e2, t2, n2 = null) {
    this.name = t2.name || null, this.description = t2.description || null, this.type = t2.type, this.componentType = t2.componentType || null, this.enumType = t2.enumType || null, this.array = t2.array || false, this.count = t2.count || 0, this.normalized = t2.normalized || false, this.offset = t2.offset || 0, this.scale = K3(t2, "scale", 1), this.max = K3(t2, "max", Infinity), this.min = K3(t2, "min", -Infinity), this.required = t2.required || false, this.noData = K3(t2, "noData", null), this.default = K3(t2, "default", null), this.semantic = K3(t2, "semantic", null), this.enumSet = null, this.accessorProperty = n2, n2 && (this.offset = K3(n2, "offset", this.offset), this.scale = K3(n2, "scale", this.scale), this.max = K3(n2, "max", this.max), this.min = K3(n2, "min", this.min)), t2.type === "ENUM" && (this.enumSet = e2[this.enumType], this.componentType === null && (this.componentType = K3(this.enumSet, "valueType", "UINT16")));
  }
  shapeToProperty(e2, t2 = null) {
    return vr(this, e2, t2);
  }
  resolveDefaultElement(e2) {
    return mr(this, e2);
  }
  resolveDefault(e2) {
    return pr(this, e2);
  }
  resolveNoData(e2) {
    return hr(this, e2);
  }
  resolveEnumsToStrings(e2) {
    let t2 = this.enumSet;
    if (this.type === "ENUM") if (Array.isArray(e2)) for (let t3 = 0, r2 = e2.length; t3 < r2; t3++) e2[t3] = n2(e2[t3]);
    else e2 = n2(e2);
    return e2;
    function n2(e3) {
      let n3 = t2.values.find((t3) => t3.value === e3);
      return n3 === null ? "" : n3.name;
    }
  }
  adjustValueScaleOffset(e2) {
    return ar(this.type) ? _r(this, e2) : e2;
  }
};
var Sr = class {
  constructor(e2, t2 = {}, n2 = {}, r2 = null) {
    this.definition = e2, this.class = t2[e2.class], this.className = e2.class, this.enums = n2, this.data = r2, this.name = "name" in e2 ? e2.name : null, this.properties = null;
  }
  getPropertyNames() {
    return Object.keys(this.class.properties);
  }
  includesData(e2) {
    return !!this.definition.properties[e2];
  }
  dispose() {
  }
  _initProperties(e2 = xr) {
    let t2 = {};
    for (let n2 in this.class.properties) t2[n2] = new e2(this.enums, this.class.properties[n2], this.definition.properties[n2]);
    this.properties = t2;
  }
};
var Cr = class extends xr {
  constructor(e2, t2, n2 = null) {
    super(e2, t2, n2), this.attribute = n2?.attribute ?? null;
  }
};
var wr = class extends Sr {
  constructor(...e2) {
    super(...e2), this.isPropertyAttributeAccessor = true, this._initProperties(Cr);
  }
  getData(e2, t2, n2 = {}) {
    let r2 = this.properties;
    yr(r2, n2);
    for (let i3 in r2) n2[i3] = this.getPropertyValue(i3, e2, t2, n2[i3]);
    return n2;
  }
  getPropertyValue(e2, t2, n2, r2 = null) {
    if (t2 >= this.count) throw Error("PropertyAttributeAccessor: Requested index is outside the range of the buffer.");
    let i3 = this.properties[e2], a3 = i3.type;
    if (!i3) throw Error("PropertyAttributeAccessor: Requested class property does not exist.");
    if (!this.definition.properties[e2]) return i3.resolveDefault(r2);
    r2 = i3.shapeToProperty(r2);
    let o3 = n2.getAttribute(i3.attribute.toLowerCase());
    if (cr(a3)) {
      let e3 = r2.elements;
      for (let n3 = e3.length; 0 < n3; ) e3[0] = o3.getComponent(t2, 0);
    } else if (sr(a3)) r2.fromBufferAttribute(o3, t2);
    else if (a3 === "SCALAR" || a3 === "ENUM") r2 = o3.getX(t2);
    else throw Error("StructuredMetadata.PropertyAttributeAccessor: BOOLEAN and STRING types are not supported by property attributes.");
    return r2 = i3.adjustValueScaleOffset(r2), r2 = i3.resolveEnumsToStrings(r2), r2 = i3.resolveNoData(r2), r2;
  }
};
var Tr = class extends xr {
  constructor(e2, t2, n2 = null) {
    super(e2, t2, n2), this.values = n2?.values ?? null, this.valueLength = br(this.type), this.arrayOffsets = K3(n2, "arrayOffsets", null), this.stringOffsets = K3(n2, "stringOffsets", null), this.arrayOffsetType = K3(n2, "arrayOffsetType", "UINT32"), this.stringOffsetType = K3(n2, "stringOffsetType", "UINT32");
  }
  getArrayLengthFromId(e2, t2) {
    let n2 = this.count;
    if (this.arrayOffsets !== null) {
      let { arrayOffsets: r2, arrayOffsetType: i3 } = this, a3 = new (fr(i3))(e2[r2]);
      n2 = a3[t2 + 1] - a3[t2];
    }
    return n2;
  }
  getIndexOffsetFromId(e2, t2) {
    let n2 = t2;
    if (this.arrayOffsets) {
      let { arrayOffsets: t3, arrayOffsetType: r2 } = this;
      n2 = new (fr(r2))(e2[t3])[n2];
    } else this.array && (n2 *= this.count);
    return n2;
  }
};
var Er = class extends Sr {
  constructor(...e2) {
    super(...e2), this.isPropertyTableAccessor = true, this.count = this.definition.count, this._initProperties(Tr);
  }
  getData(e2, t2 = {}) {
    let n2 = this.properties;
    yr(n2, t2);
    for (let r2 in n2) t2[r2] = this.getPropertyValue(r2, e2, t2[r2]);
    return t2;
  }
  _readValueAtIndex(e2, t2, n2, r2 = null) {
    let i3 = this.properties[e2], { componentType: a3, type: o3 } = i3, s3 = this.data, c3 = s3[i3.values], l3 = new (fr(a3, o3))(c3), u4 = i3.getIndexOffsetFromId(s3, t2);
    if (ar(o3) || o3 === "ENUM") return lr(l3, (u4 + n2) * i3.valueLength, o3, r2);
    if (o3 === "STRING") {
      let e3 = u4 + n2, t3 = 0;
      if (i3.stringOffsets !== null) {
        let { stringOffsets: n3, stringOffsetType: r3 } = i3, a5 = new (fr(r3))(s3[n3]);
        t3 = a5[e3 + 1] - a5[e3], e3 = a5[e3];
      }
      let a4 = new Uint8Array(l3.buffer, e3, t3);
      r2 = new TextDecoder().decode(a4);
    } else if (o3 === "BOOLEAN") {
      let e3 = u4 + n2, t3 = Math.floor(e3 / 8), i4 = e3 % 8;
      r2 = (l3[t3] >> i4 & 1) == 1;
    }
    return r2;
  }
  getPropertyValue(e2, t2, n2 = null) {
    if (t2 >= this.count) throw Error("PropertyTableAccessor: Requested index is outside the range of the table.");
    let r2 = this.properties[e2];
    if (!r2) throw Error("PropertyTableAccessor: Requested property does not exist.");
    if (!this.definition.properties[e2]) return r2.resolveDefault(n2);
    let i3 = r2.array, a3 = this.data, o3 = r2.getArrayLengthFromId(a3, t2);
    if (n2 = r2.shapeToProperty(n2, o3), i3) for (let r3 = 0, i4 = n2.length; r3 < i4; r3++) n2[r3] = this._readValueAtIndex(e2, t2, r3, n2[r3]);
    else n2 = this._readValueAtIndex(e2, t2, 0, n2);
    return n2 = r2.adjustValueScaleOffset(n2), n2 = r2.resolveEnumsToStrings(n2), n2 = r2.resolveNoData(n2), n2;
  }
};
var Dr = /* @__PURE__ */ new _5();
var Or = class {
  constructor() {
    this._renderer = new Fe2(), this._target = new Pe2(1, 1), this._texTarget = new Pe2(), this._quad = new Re2(new we2({
      blending: T5,
      blendDst: Ie2,
      blendSrc: fe2,
      uniforms: {
        map: { value: null },
        pixel: { value: new I4() }
      },
      vertexShader: "\n				void main() {\n\n					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\n				}\n			",
      fragmentShader: "\n				uniform sampler2D map;\n				uniform ivec2 pixel;\n\n				void main() {\n\n					gl_FragColor = texelFetch( map, pixel, 0 );\n\n				}\n			"
    }));
  }
  increaseSizeTo(e2) {
    this._target.setSize(Math.max(this._target.width, e2), 1);
  }
  readDataAsync(e2) {
    let { _renderer: t2, _target: n2 } = this;
    return t2.readRenderTargetPixelsAsync(n2, 0, 0, e2.length / 4, 1, e2);
  }
  readData(e2) {
    let { _renderer: t2, _target: n2 } = this;
    t2.readRenderTargetPixels(n2, 0, 0, e2.length / 4, 1, e2);
  }
  renderPixelToTarget(e2, t2, n2) {
    let { _renderer: r2, _target: i3 } = this;
    Dr.min.copy(t2), Dr.max.copy(t2), Dr.max.x += 1, Dr.max.y += 1, r2.initRenderTarget(i3), r2.copyTextureToTexture(e2, i3.texture, Dr, n2, 0);
  }
};
var kr = /* @__PURE__ */ new class {
  constructor() {
    let e2 = null;
    Object.getOwnPropertyNames(Or.prototype).forEach((t2) => {
      t2 !== "constructor" && (this[t2] = (...n2) => (e2 || (e2 = new Or()), e2[t2](...n2)));
    });
  }
}();
var Ar = /* @__PURE__ */ new I4();
var jr = /* @__PURE__ */ new I4();
var Mr = /* @__PURE__ */ new I4();
function Nr(e2, t2) {
  return t2 === 0 ? e2.getAttribute("uv") : e2.getAttribute(`uv${t2}`);
}
function Pr(e2, t2, n2 = [
  ,
  ,
  ,
]) {
  let r2 = 3 * t2, i3 = 3 * t2 + 1, a3 = 3 * t2 + 2;
  return e2.index && (r2 = e2.index.getX(r2), i3 = e2.index.getX(i3), a3 = e2.index.getX(a3)), n2[0] = r2, n2[1] = i3, n2[2] = a3, n2;
}
function Fr(e2, t2, n2, r2, i3) {
  let [a3, o3, s3] = r2, c3 = Nr(e2, t2);
  Ar.fromBufferAttribute(c3, a3), jr.fromBufferAttribute(c3, o3), Mr.fromBufferAttribute(c3, s3), i3.set(0, 0, 0).addScaledVector(Ar, n2.x).addScaledVector(jr, n2.y).addScaledVector(Mr, n2.z);
}
function Ir(e2, t2, n2, r2) {
  let i3 = e2.x - Math.floor(e2.x), a3 = e2.y - Math.floor(e2.y), o3 = Math.floor(i3 * t2 % t2), s3 = Math.floor(a3 * n2 % n2);
  return r2.set(o3, s3), r2;
}
var Lr = /* @__PURE__ */ new I4();
var Rr = /* @__PURE__ */ new I4();
var zr = /* @__PURE__ */ new I4();
var Br = class extends xr {
  constructor(e2, t2, n2 = null) {
    super(e2, t2, n2), this.channels = K3(n2, "channels", [0]), this.index = K3(n2, "index", null), this.texCoord = K3(n2, "texCoord", null), this.valueLength = parseInt(this.type.replace(/[^0-9]/g, "")) || 1;
  }
  readDataFromBuffer(e2, t2, n2 = null) {
    let r2 = this.type;
    if (r2 === "BOOLEAN" || r2 === "STRING") throw Error("PropertyTextureAccessor: BOOLEAN and STRING types not supported.");
    return lr(e2, t2 * this.valueLength, r2, n2);
  }
};
var Vr = class extends Sr {
  constructor(...e2) {
    super(...e2), this.isPropertyTextureAccessor = true, this._asyncRead = false, this._initProperties(Br);
  }
  getData(e2, t2, n2, r2 = {}) {
    let i3 = this.properties;
    yr(i3, r2);
    let a3 = Object.keys(i3), o3 = a3.map((e3) => r2[e3]);
    return this.getPropertyValuesAtTexel(a3, e2, t2, n2, o3), a3.forEach((e3, t3) => r2[e3] = o3[t3]), r2;
  }
  async getDataAsync(e2, t2, n2, r2 = {}) {
    let i3 = this.properties;
    yr(i3, r2);
    let a3 = Object.keys(i3), o3 = a3.map((e3) => r2[e3]);
    return await this.getPropertyValuesAtTexelAsync(a3, e2, t2, n2, o3), a3.forEach((e3, t3) => r2[e3] = o3[t3]), r2;
  }
  getPropertyValuesAtTexelAsync(...e2) {
    this._asyncRead = true;
    let t2 = this.getPropertyValuesAtTexel(...e2);
    return this._asyncRead = false, t2;
  }
  getPropertyValuesAtTexel(e2, t2, n2, r2, i3 = []) {
    for (; i3.length < e2.length; ) i3.push(null);
    i3.length = e2.length, kr.increaseSizeTo(i3.length);
    let a3 = this.data, o3 = this.definition.properties, s3 = this.properties, c3 = Pr(r2, t2);
    for (let t3 = 0, i4 = e2.length; t3 < i4; t3++) {
      let i5 = e2[t3];
      if (!o3[i5]) continue;
      let l4 = s3[i5], u5 = a3[l4.index];
      Fr(r2, l4.texCoord, n2, c3, Lr), Ir(Lr, u5.image.width, u5.image.height, Rr), zr.set(t3, 0), kr.renderPixelToTarget(u5, Rr, zr);
    }
    let l3 = new Uint8Array(e2.length * 4);
    if (this._asyncRead) return kr.readDataAsync(l3).then(() => (u4.call(this), i3));
    return kr.readData(l3), u4.call(this), i3;
    function u4() {
      for (let t3 = 0, n3 = e2.length; t3 < n3; t3++) {
        let n4 = e2[t3], r3 = s3[n4], a4 = r3.type;
        if (i3[t3] = vr(r3, i3[t3]), !r3) throw Error("PropertyTextureAccessor: Requested property does not exist.");
        if (!o3[n4]) {
          i3[t3] = r3.resolveDefault(i3);
          continue;
        }
        let c4 = r3.valueLength * (r3.count || 1), u5 = r3.channels.map((e3) => l3[4 * t3 + e3]), d5 = r3.componentType, f4 = new (fr(d5, a4))(c4);
        if (new Uint8Array(f4.buffer).set(u5), r3.array) {
          let e3 = i3[t3];
          for (let t4 = 0, n5 = e3.length; t4 < n5; t4++) e3[t4] = r3.readDataFromBuffer(f4, t4, e3[t4]);
        } else i3[t3] = r3.readDataFromBuffer(f4, 0, i3[t3]);
        i3[t3] = r3.adjustValueScaleOffset(i3[t3]), i3[t3] = r3.resolveEnumsToStrings(i3[t3]), i3[t3] = r3.resolveNoData(i3[t3]);
      }
    }
  }
  dispose() {
    this.data.forEach((e2) => {
      e2 && (e2.dispose(), e2.image instanceof ImageBitmap && e2.image.close());
    });
  }
};
var Hr = class {
  constructor(e2, t2, n2, r2 = null, i3 = null) {
    let { schema: a3, propertyTables: o3 = [], propertyTextures: s3 = [], propertyAttributes: c3 = [] } = e2, { enums: l3, classes: u4 } = a3, d5 = o3.map((e3) => new Er(e3, u4, l3, n2)), f4 = [], p4 = [];
    r2 && (r2.propertyTextures && (f4 = r2.propertyTextures.map((e3) => new Vr(s3[e3], u4, l3, t2))), r2.propertyAttributes && (p4 = r2.propertyAttributes.map((e3) => new wr(c3[e3], u4, l3)))), this.schema = a3, this.tableAccessors = d5, this.textureAccessors = f4, this.attributeAccessors = p4, this.object = i3, this.textures = t2, this.nodeMetadata = r2;
  }
  getPropertyTableData(e2, t2, n2 = null) {
    if (!Array.isArray(e2)) n2 || (n2 = {}), n2 = this.tableAccessors[e2].getData(t2, n2);
    else {
      n2 || (n2 = []);
      let r2 = Math.min(e2.length, t2.length);
      n2.length = r2;
      for (let i3 = 0; i3 < r2; i3++) {
        let r3 = this.tableAccessors[e2[i3]];
        n2[i3] = r3.getData(t2[i3], n2[i3]);
      }
    }
    if (Array.isArray(e2) !== Array.isArray(n2) || Array.isArray(e2) !== Array.isArray(t2)) throw Error("StructuralMetadata: Scalar and array inputs cannot be mixed.");
    return n2;
  }
  getPropertyTableInfo(e2 = null) {
    if (e2 === null && (e2 = this.tableAccessors.map((e3, t2) => t2)), Array.isArray(e2)) return e2.map((e3) => {
      let t2 = this.tableAccessors[e3];
      return {
        name: t2.name,
        className: t2.definition.class
      };
    });
    {
      let t2 = this.tableAccessors[e2];
      return {
        name: t2.name,
        className: t2.definition.class
      };
    }
  }
  getPropertyTextureData(e2, t2, n2 = []) {
    let r2 = this.textureAccessors;
    n2.length = r2.length;
    for (let i3 = 0; i3 < r2.length; i3++) n2[i3] = r2[i3].getData(e2, t2, this.object.geometry, n2[i3]);
    return n2;
  }
  async getPropertyTextureDataAsync(e2, t2, n2 = []) {
    let r2 = this.textureAccessors;
    n2.length = r2.length;
    let i3 = [];
    for (let a3 = 0; a3 < r2.length; a3++) {
      let o3 = r2[a3].getDataAsync(e2, t2, this.object.geometry, n2[a3]).then((e3) => {
        n2[a3] = e3;
      });
      i3.push(o3);
    }
    return await Promise.all(i3), n2;
  }
  getPropertyTextureInfo() {
    return this.textureAccessors;
  }
  getPropertyAttributeData(e2, t2 = []) {
    let n2 = this.attributeAccessors;
    t2.length = n2.length;
    for (let r2 = 0; r2 < n2.length; r2++) t2[r2] = n2[r2].getData(e2, this.object.geometry, t2[r2]);
    return t2;
  }
  getPropertyAttributeInfo() {
    return this.attributeAccessors.map((e2) => ({
      name: e2.name,
      className: e2.definition.class
    }));
  }
  dispose() {
    this.textureAccessors.forEach((e2) => e2.dispose()), this.tableAccessors.forEach((e2) => e2.dispose()), this.attributeAccessors.forEach((e2) => e2.dispose());
  }
};
var Ur = "EXT_structural_metadata";
function Wr(e2, t2 = []) {
  let n2 = e2.json.textures?.length || 0, r2 = Array(n2).fill(null);
  return t2.forEach(({ properties: t3 }) => {
    for (let n3 in t3) {
      let { index: i3 } = t3[n3];
      r2[i3] === null && (r2[i3] = e2.loadTexture(i3));
    }
  }), Promise.all(r2);
}
function Gr(e2, t2 = []) {
  let n2 = e2.json.bufferViews?.length || 0, r2 = Array(n2).fill(null);
  return t2.forEach(({ properties: t3 }) => {
    for (let n3 in t3) {
      let { values: i3, arrayOffsets: a3, stringOffsets: o3 } = t3[n3];
      r2[i3] === null && (r2[i3] = e2.getDependency("bufferView", i3)), r2[a3] === null && (r2[a3] = e2.getDependency("bufferView", a3)), r2[o3] === null && (r2[o3] = e2.getDependency("bufferView", o3));
    }
  }), Promise.all(r2);
}
var Kr = class {
  constructor(e2) {
    this.parser = e2, this.name = Ur;
  }
  async afterRoot({ scene: e2, parser: t2 }) {
    let n2 = t2.json.extensionsUsed;
    if (!n2 || !n2.includes(Ur)) return;
    let r2 = null, i3 = t2.json.extensions[Ur];
    if (i3.schemaUri) {
      let { manager: e3, path: n3, requestHeader: a4, crossOrigin: o4 } = t2.options, s4 = new URL(i3.schemaUri, n3).toString(), c3 = new A5(e3);
      c3.setCrossOrigin(o4), c3.setResponseType("json"), c3.setRequestHeader(a4), r2 = c3.loadAsync(s4).then((e4) => {
        i3 = {
          ...i3,
          schema: e4
        };
      });
    }
    let [a3, o3] = await Promise.all([
      Wr(t2, i3.propertyTextures),
      Gr(t2, i3.propertyTables),
      r2
    ]), s3 = new Hr(i3, a3, o3);
    e2.userData.structuralMetadata = s3, e2.traverse((e3) => {
      if (t2.associations.has(e3)) {
        let { meshes: n3, primitives: r3 } = t2.associations.get(e3), c3 = t2.json.meshes[n3]?.primitives[r3];
        if (c3 && c3.extensions && c3.extensions[Ur]) {
          let t3 = c3.extensions[Ur];
          e3.userData.structuralMetadata = new Hr(i3, a3, o3, t3, e3);
        } else e3.userData.structuralMetadata = s3;
      }
    });
  }
};
var qr = /* @__PURE__ */ new I4();
var Jr = /* @__PURE__ */ new I4();
var Yr = /* @__PURE__ */ new I4();
function Xr(e2) {
  return e2.x > e2.y && e2.x > e2.z ? 0 : e2.y > e2.z ? 1 : 2;
}
var Zr = class {
  constructor(e2, t2, n2) {
    this.geometry = e2, this.textures = t2, this.data = n2, this._asyncRead = false, this.featureIds = n2.featureIds.map((e3) => {
      let { texture: t3, ...n3 } = e3, r2 = {
        label: null,
        propertyTable: null,
        nullFeatureId: null,
        ...n3
      };
      return t3 && (r2.texture = {
        texCoord: 0,
        channels: [0],
        ...t3
      }), r2;
    });
  }
  getTextures() {
    return this.textures;
  }
  getFeatureInfo() {
    return this.featureIds;
  }
  getFeaturesAsync(...e2) {
    this._asyncRead = true;
    let t2 = this.getFeatures(...e2);
    return this._asyncRead = false, t2;
  }
  getFeatures(e2, t2) {
    let { geometry: n2, textures: r2, featureIds: i3 } = this, a3 = Array(i3.length).fill(null), o3 = i3.length;
    kr.increaseSizeTo(o3);
    let s3 = Pr(n2, e2), c3 = s3[Xr(t2)];
    for (let e3 = 0, o4 = i3.length; e3 < o4; e3++) {
      let o5 = i3[e3], l4 = "nullFeatureId" in o5 ? o5.nullFeatureId : null;
      if ("texture" in o5) {
        let i4 = r2[o5.texture.index];
        Fr(n2, o5.texture.texCoord, t2, s3, qr), Ir(qr, i4.image.width, i4.image.height, Jr), Yr.set(e3, 0), kr.renderPixelToTarget(r2[o5.texture.index], Jr, Yr);
      } else if ("attribute" in o5) {
        let t3 = n2.getAttribute(`_feature_id_${o5.attribute}`).getX(c3);
        t3 !== l4 && (a3[e3] = t3);
      } else {
        let t3 = c3;
        t3 !== l4 && (a3[e3] = t3);
      }
    }
    let l3 = new Uint8Array(o3 * 4);
    if (this._asyncRead) return kr.readDataAsync(l3).then(() => (u4(), a3));
    return kr.readData(l3), u4(), a3;
    function u4() {
      let e3 = new Uint32Array(1);
      for (let t3 = 0, n3 = i3.length; t3 < n3; t3++) {
        let n4 = i3[t3], r3 = "nullFeatureId" in n4 ? n4.nullFeatureId : null;
        if ("texture" in n4) {
          let { channels: i4 } = n4.texture, o4 = i4.map((e4) => l3[4 * t3 + e4]);
          new Uint8Array(e3.buffer).set(o4);
          let s4 = e3[0];
          s4 !== r3 && (a3[t3] = s4);
        }
      }
    }
  }
  dispose() {
    this.textures.forEach((e2) => {
      e2 && (e2.dispose(), e2.image instanceof ImageBitmap && e2.image.close());
    });
  }
};
var Qr = "EXT_mesh_features";
function $r(e2, t2, n2) {
  e2.traverse((e3) => {
    if (t2.associations.has(e3)) {
      let { meshes: r2, primitives: i3 } = t2.associations.get(e3), a3 = t2.json.meshes[r2]?.primitives[i3];
      a3 && a3.extensions && a3.extensions[Qr] && n2(e3, a3.extensions[Qr]);
    }
  });
}
var ei = class {
  constructor(e2) {
    this.parser = e2, this.name = Qr;
  }
  async afterRoot({ scene: e2, parser: t2 }) {
    let n2 = t2.json.extensionsUsed;
    if (!n2 || !n2.includes(Qr)) return;
    let r2 = t2.json.textures?.length || 0, i3 = Array(r2).fill(null);
    $r(e2, t2, (e3, { featureIds: n3 }) => {
      n3.forEach((e4) => {
        if (e4.texture && i3[e4.texture.index] === null) {
          let n4 = e4.texture.index;
          i3[n4] = t2.loadTexture(n4);
        }
      });
    });
    let a3 = await Promise.all(i3);
    $r(e2, t2, (e3, t3) => {
      e3.userData.meshFeatures = new Zr(e3.geometry, a3, t3);
    });
  }
};
var ti = class {
  constructor() {
    this.name = "CESIUM_RTC";
  }
  afterRoot(e2) {
    if (e2.parser.json.extensions && e2.parser.json.extensions.CESIUM_RTC) {
      let { center: t2 } = e2.parser.json.extensions.CESIUM_RTC;
      t2 && (e2.scene.position.x += t2[0], e2.scene.position.y += t2[1], e2.scene.position.z += t2[2]);
    }
  }
};
var ni = class {
  constructor(e2) {
    e2 = {
      metadata: true,
      rtc: true,
      plugins: [],
      dracoLoader: null,
      ktxLoader: null,
      meshoptDecoder: null,
      autoDispose: true,
      ...e2
    }, this.tiles = null, this.metadata = e2.metadata, this.rtc = e2.rtc, this.plugins = e2.plugins, this.dracoLoader = e2.dracoLoader, this.ktxLoader = e2.ktxLoader, this.meshoptDecoder = e2.meshoptDecoder, this._gltfRegex = /\.(gltf|glb)$/g, this._dracoRegex = /\.drc$/g, this._loader = null;
  }
  init(e2) {
    let t2 = new Le2(e2.manager);
    this.dracoLoader && (t2.setDRACOLoader(this.dracoLoader), e2.manager.addHandler(this._dracoRegex, this.dracoLoader)), this.ktxLoader && t2.setKTX2Loader(this.ktxLoader), this.meshoptDecoder && t2.setMeshoptDecoder(this.meshoptDecoder), this.rtc && t2.register(() => new ti()), this.metadata && (t2.register(() => new Kr()), t2.register(() => new ei())), this.plugins.forEach((e3) => t2.register(e3)), e2.manager.addHandler(this._gltfRegex, t2), this.tiles = e2, this._loader = t2;
  }
  dispose() {
    this.tiles.manager.removeHandler(this._gltfRegex), this.tiles.manager.removeHandler(this._dracoRegex), this.autoDispose && (this.ktxLoader.dispose(), this.dracoLoader.dispose());
  }
};
var ri = /* @__PURE__ */ new Ee2();
var ii = class {
  constructor(e2) {
    e2 = {
      up: "+z",
      recenter: true,
      lat: null,
      lon: null,
      height: 0,
      azimuth: 0,
      elevation: 0,
      roll: 0,
      ...e2
    }, this.tiles = null, this.up = e2.up.toLowerCase().replace(/\s+/, ""), this.lat = e2.lat, this.lon = e2.lon, this.height = e2.height, this.azimuth = e2.azimuth, this.elevation = e2.elevation, this.roll = e2.roll, this.recenter = e2.recenter, this._callback = null;
  }
  init(e2) {
    this.tiles = e2, this._callback = () => {
      let { up: t2, lat: n2, lon: r2, height: i3, azimuth: a3, elevation: o3, roll: s3, recenter: c3 } = this;
      if (n2 !== null && r2 !== null) this.transformLatLonHeightToOrigin(n2, r2, i3, a3, o3, s3);
      else {
        let { ellipsoid: n3 } = e2, r3 = Math.min(...n3.radius);
        if (e2.getBoundingSphere(ri), ri.center.length() > r3 * 0.5) {
          let e3 = {};
          n3.getPositionToCartographic(ri.center, e3), this.transformLatLonHeightToOrigin(e3.lat, e3.lon, e3.height);
        } else {
          let n4 = e2.group;
          switch (n4.rotation.set(0, 0, 0), t2) {
            case "x":
            case "+x":
              n4.rotation.z = Math.PI / 2;
              break;
            case "-x":
              n4.rotation.z = -Math.PI / 2;
              break;
            case "y":
            case "+y":
              break;
            case "-y":
              n4.rotation.z = Math.PI;
              break;
            case "z":
            case "+z":
              n4.rotation.x = -Math.PI / 2;
              break;
            case "-z":
              n4.rotation.x = Math.PI / 2;
              break;
          }
          e2.group.position.copy(ri.center).applyEuler(n4.rotation).multiplyScalar(-1);
        }
      }
      c3 || e2.group.position.setScalar(0), e2.removeEventListener("load-root-tileset", this._callback);
    }, e2.addEventListener("load-root-tileset", this._callback), e2.root && this._callback();
  }
  transformLatLonHeightToOrigin(e2, t2, n2 = 0, r2 = 0, i3 = 0, a3 = 0) {
    let { group: o3, ellipsoid: s3 } = this.tiles;
    s3.getObjectFrame(e2, t2, n2, r2, i3, a3, o3.matrix, 2), o3.matrix.invert().decompose(o3.position, o3.quaternion, o3.scale), o3.updateMatrixWorld();
  }
  dispose() {
    let { group: e2 } = this.tiles;
    e2.position.setScalar(0), e2.quaternion.identity(), e2.scale.set(1, 1, 1), this.tiles.removeEventListener("load-root-tileset", this._callback);
  }
};
var ai = class {
  set delay(e2) {
    this.deferCallbacks.delay = e2;
  }
  get delay() {
    return this.deferCallbacks.delay;
  }
  set bytesTarget(e2) {
    this.lruCache.minBytesSize = e2;
  }
  get bytesTarget() {
    return this.lruCache.minBytesSize;
  }
  get estimatedGpuBytes() {
    return this.lruCache.cachedBytes;
  }
  constructor(e2 = {}) {
    let { delay: t2 = 0, bytesTarget: r2 = 0 } = e2;
    this.name = "UNLOAD_TILES_PLUGIN", this.tiles = null, this.lruCache = new o(), this.deferCallbacks = new oi(), this.delay = t2, this.bytesTarget = r2;
  }
  init(e2) {
    this.tiles = e2;
    let { lruCache: t2, deferCallbacks: n2 } = this, r2 = (t3) => {
      let n3 = t3.engineData.scene;
      e2.visibleTiles.has(t3) || e2.invokeOnePlugin((e3) => e3.unloadTileFromGPU && e3.unloadTileFromGPU(n3, t3));
    };
    this._onUpdateBefore = () => {
      t2.unloadPriorityCallback = e2.lruCache.unloadPriorityCallback, t2.minSize = Infinity, t2.maxSize = Infinity, t2.maxBytesSize = Infinity, t2.unloadPercent = 1, t2.autoMarkUnused = false;
    }, this._onVisibilityChangeCallback = ({ tile: i3, scene: a3, visible: o3 }) => {
      o3 ? (t2.add(i3, r2), t2.setMemoryUsage(i3, e2.calculateBytesUsed(i3, a3) || 1), e2.markTileUsed(i3), n2.cancel(i3)) : n2.run(i3);
    }, this._onDisposeModel = ({ tile: e3 }) => {
      t2.remove(e3), n2.cancel(e3);
    }, n2.callback = (e3) => {
      t2.markUnused(e3), t2.scheduleUnload();
    }, e2.forEachLoadedModel((t3, n3) => {
      let r3 = e2.visibleTiles.has(n3);
      this._onVisibilityChangeCallback({
        tile: n3,
        visible: r3
      });
    }), e2.addEventListener("tile-visibility-change", this._onVisibilityChangeCallback), e2.addEventListener("update-before", this._onUpdateBefore), e2.addEventListener("dispose-model", this._onDisposeModel);
  }
  unloadTileFromGPU(e2, t2) {
    e2 && e2.traverse((e3) => {
      if (e3.material) {
        let t3 = e3.material;
        t3.dispose();
        for (let e4 in t3) {
          let n2 = t3[e4];
          n2 && n2.isTexture && n2.dispose();
        }
      }
      e3.geometry && e3.geometry.dispose();
    });
  }
  dispose() {
    let { lruCache: e2, tiles: t2, deferCallbacks: n2 } = this;
    t2.removeEventListener("tile-visibility-change", this._onVisibilityChangeCallback), t2.removeEventListener("update-before", this._onUpdateBefore), t2.removeEventListener("dispose-model", this._onDisposeModel), n2.cancelAll(), e2.minBytesSize = 0, e2.minSize = 0, e2.maxSize = 0, e2.markAllUnused(), e2.scheduleUnload();
  }
};
var oi = class {
  constructor(e2 = () => {
  }) {
    this.map = /* @__PURE__ */ new Map(), this.callback = e2, this.delay = 0;
  }
  run(e2) {
    let { map: t2, delay: n2 } = this;
    if (t2.has(e2)) throw Error("DeferCallbackManager: Callback already initialized.");
    n2 === 0 ? this.callback(e2) : t2.set(e2, setTimeout(() => {
      this.callback(e2), t2.delete(e2);
    }, n2));
  }
  cancel(e2) {
    let { map: t2 } = this;
    t2.has(e2) && (clearTimeout(t2.get(e2)), t2.delete(e2));
  }
  cancelAll() {
    this.map.forEach((e2, t2) => {
      this.cancel(t2);
    });
  }
};
var { clamp: si } = N4;
var ci = class {
  constructor() {
    this.duration = 250, this.fadeCount = 0, this._lastTick = -1, this._fadeState = /* @__PURE__ */ new Map(), this.onFadeComplete = null, this.onFadeStart = null, this.onFadeSetComplete = null, this.onFadeSetStart = null;
  }
  deleteObject(e2) {
    e2 && this.completeFade(e2);
  }
  guaranteeState(e2) {
    let t2 = this._fadeState;
    return t2.has(e2) ? false : (t2.set(e2, {
      fadeInTarget: 0,
      fadeOutTarget: 0,
      fadeIn: 0,
      fadeOut: 0
    }), true);
  }
  completeFade(e2) {
    let t2 = this._fadeState;
    if (!t2.has(e2)) return;
    let n2 = t2.get(e2).fadeOutTarget === 0;
    t2.delete(e2), this.fadeCount--, this.onFadeComplete && this.onFadeComplete(e2, n2), this.fadeCount === 0 && this.onFadeSetComplete && this.onFadeSetComplete();
  }
  completeAllFades() {
    this._fadeState.forEach((e2, t2) => {
      this.completeFade(t2);
    });
  }
  forEachObject(e2) {
    this._fadeState.forEach((t2, n2) => {
      e2(n2, t2);
    });
  }
  fadeIn(e2) {
    let t2 = this.guaranteeState(e2), n2 = this._fadeState.get(e2);
    n2.fadeInTarget = 1, n2.fadeOutTarget = 0, n2.fadeOut = 0, t2 && (this.fadeCount++, this.fadeCount === 1 && this.onFadeSetStart && this.onFadeSetStart(), this.onFadeStart && this.onFadeStart(e2));
  }
  fadeOut(e2) {
    let t2 = this.guaranteeState(e2), n2 = this._fadeState.get(e2);
    n2.fadeOutTarget = 1, t2 && (n2.fadeInTarget = 1, n2.fadeIn = 1, this.fadeCount++, this.fadeCount === 1 && this.onFadeSetStart && this.onFadeSetStart(), this.onFadeStart && this.onFadeStart(e2));
  }
  isFading(e2) {
    return this._fadeState.has(e2);
  }
  isFadingOut(e2) {
    let t2 = this._fadeState.get(e2);
    return t2 && t2.fadeOutTarget === 1;
  }
  update() {
    let e2 = window.performance.now();
    this._lastTick === -1 && (this._lastTick = e2);
    let t2 = si((e2 - this._lastTick) / this.duration, 0, 1);
    this._lastTick = e2, this._fadeState.forEach((e3, n2) => {
      let { fadeOutTarget: r2, fadeInTarget: i3 } = e3, { fadeOut: a3, fadeIn: o3 } = e3, s3 = Math.sign(i3 - o3);
      o3 = si(o3 + s3 * t2, 0, 1);
      let c3 = Math.sign(r2 - a3);
      a3 = si(a3 + c3 * t2, 0, 1), e3.fadeIn = o3, e3.fadeOut = a3, ((a3 === 1 || a3 === 0) && (o3 === 1 || o3 === 0) || a3 >= o3) && this.completeFade(n2);
    });
  }
};
var li = Symbol("FADE_PARAMS");
function ui(e2, t2) {
  if (e2[li]) return e2[li];
  let n2 = {
    fadeIn: { value: 0 },
    fadeOut: { value: 0 },
    fadeTexture: { value: null }
  };
  return e2[li] = n2, e2.defines = {
    ...e2.defines || {},
    FEATURE_FADE: 0
  }, e2.onBeforeCompile = (e3) => {
    t2 && t2(e3), e3.uniforms = {
      ...e3.uniforms,
      ...n2
    }, e3.vertexShader = e3.vertexShader.replace(/void\s+main\(\)\s+{/, (e4) => `
					#ifdef USE_BATCHING_FRAG

					varying float vBatchId;

					#endif

					${e4}

						#ifdef USE_BATCHING_FRAG

						// add 0.5 to the value to avoid floating error that may cause flickering
						vBatchId = getIndirectIndex( gl_DrawID ) + 0.5;

						#endif
				`), e3.fragmentShader = e3.fragmentShader.replace(/void main\(/, (e4) => `
				#if FEATURE_FADE

				// adapted from https://www.shadertoy.com/view/Mlt3z8
				float bayerDither2x2( vec2 v ) {

					return mod( 3.0 * v.y + 2.0 * v.x, 4.0 );

				}

				float bayerDither4x4( vec2 v ) {

					vec2 P1 = mod( v, 2.0 );
					vec2 P2 = floor( 0.5 * mod( v, 4.0 ) );
					return 4.0 * bayerDither2x2( P1 ) + bayerDither2x2( P2 );

				}

				// the USE_BATCHING define is not available in fragment shaders
				#ifdef USE_BATCHING_FRAG

				// functions for reading the fade state of a given batch id
				uniform sampler2D fadeTexture;
				varying float vBatchId;
				vec2 getFadeValues( const in float i ) {

					int size = textureSize( fadeTexture, 0 ).x;
					int j = int( i );
					int x = j % size;
					int y = j / size;
					return texelFetch( fadeTexture, ivec2( x, y ), 0 ).rg;

				}

				#else

				uniform float fadeIn;
				uniform float fadeOut;

				#endif

				#endif

				${e4}
			`).replace(/#include <dithering_fragment>/, (e4) => `

				${e4}

				#if FEATURE_FADE

				#ifdef USE_BATCHING_FRAG

				vec2 fadeValues = getFadeValues( vBatchId );
				float fadeIn = fadeValues.r;
				float fadeOut = fadeValues.g;

				#endif

				float bayerValue = bayerDither4x4( floor( mod( gl_FragCoord.xy, 4.0 ) ) );
				float bayerBins = 16.0;
				float dither = ( 0.5 + bayerValue ) / bayerBins;
				if ( dither >= fadeIn ) {

					discard;

				}

				if ( dither < fadeOut ) {

					discard;

				}

				#endif

			`);
  }, n2;
}
var di = class {
  constructor() {
    this._fadeParams = /* @__PURE__ */ new WeakMap(), this.fading = 0;
  }
  setFade(e2, t2, n2) {
    if (!e2) return;
    let r2 = this._fadeParams;
    e2.traverse((e3) => {
      let i3 = e3.material;
      if (i3 && r2.has(i3)) {
        let e4 = r2.get(i3);
        e4.fadeIn.value = t2, e4.fadeOut.value = n2;
        let a3 = Number(!(t2 === 0 || t2 === 1) || !(n2 === 0 || n2 === 1));
        i3.defines.FEATURE_FADE !== a3 && (this.fading += a3 === 1 ? 1 : -1, i3.defines.FEATURE_FADE = a3, i3.needsUpdate = true);
      }
    });
  }
  prepareScene(e2) {
    e2.traverse((e3) => {
      e3.material && this.prepareMaterial(e3.material);
    });
  }
  deleteScene(e2) {
    if (!e2) return;
    this.setFade(e2, 1, 0);
    let t2 = this._fadeParams;
    e2.traverse((e3) => {
      let n2 = e3.material;
      n2 && t2.delete(n2);
    });
  }
  prepareMaterial(e2) {
    let t2 = this._fadeParams;
    t2.has(e2) || t2.set(e2, ui(e2, e2.onBeforeCompile));
  }
};
var fi = class {
  constructor(e2, t2 = new F4()) {
    this.other = e2, this.material = t2, this.visible = true, this.parent = null, this._instanceInfo = [], this._visibilityChanged = true;
    let n2 = new Proxy(this, {
      get(t3, r2) {
        if (r2 in t3) return t3[r2];
        {
          let i3 = e2[r2];
          return i3 instanceof Function ? (...e3) => (t3.syncInstances(), i3.call(n2, ...e3)) : e2[r2];
        }
      },
      set(t3, n3, r2) {
        return n3 in t3 ? t3[n3] = r2 : e2[n3] = r2, true;
      },
      deleteProperty(t3, n3) {
        return n3 in t3 ? delete t3[n3] : delete e2[n3];
      }
    });
    return n2;
  }
  syncInstances() {
    let e2 = this._instanceInfo, t2 = this.other._instanceInfo;
    for (; t2.length > e2.length; ) {
      let n2 = e2.length;
      e2.push(new Proxy({ visible: false }, {
        get(e3, r2) {
          return r2 in e3 ? e3[r2] : t2[n2][r2];
        },
        set(e3, r2, i3) {
          return r2 in e3 ? e3[r2] = i3 : t2[n2][r2] = i3, true;
        }
      }));
    }
  }
};
var pi = class extends fi {
  constructor(...e2) {
    super(...e2);
    let t2 = this.material, n2 = ui(t2, t2.onBeforeCompile);
    t2.defines.FEATURE_FADE = 1, t2.defines.USE_BATCHING_FRAG = 1, t2.needsUpdate = true, this.fadeTexture = null, this._fadeParams = n2;
  }
  setFadeAt(e2, t2, n2) {
    this._initFadeTexture(), this.fadeTexture.setValueAt(e2, t2 * 255, n2 * 255);
  }
  _initFadeTexture() {
    let e2 = Math.sqrt(this._maxInstanceCount);
    e2 = Math.ceil(e2);
    let t2 = e2 * e2 * 2, n2 = this.fadeTexture;
    if (!n2 || n2.image.data.length !== t2) {
      let r2 = new mi(new Uint8Array(t2), e2, e2, ye2, je2);
      if (n2) {
        n2.dispose();
        let e3 = n2.image.data, t3 = this.fadeTexture.image.data, r3 = Math.min(e3.length, t3.length);
        t3.set(new e3.constructor(e3.buffer, 0, r3));
      }
      this.fadeTexture = r2, this._fadeParams.fadeTexture.value = r2, r2.needsUpdate = true;
    }
  }
  dispose() {
    this.fadeTexture && this.fadeTexture.dispose();
  }
};
var mi = class extends E4 {
  setValueAt(e2, ...t2) {
    let { data: n2, width: r2, height: i3 } = this.image, a3 = Math.floor(n2.length / (r2 * i3)), o3 = false;
    for (let r3 = 0; r3 < a3; r3++) {
      let i4 = e2 * a3 + r3, s3 = n2[i4], c3 = t2[r3] || 0;
      s3 !== c3 && (n2[i4] = c3, o3 = true);
    }
    o3 && (this.needsUpdate = true);
  }
};
var hi = Symbol("HAS_POPPED_IN");
function gi(e2) {
  let t2 = e2;
  for (; t2; ) {
    if (t2.traversal.wasSetActive) return t2.traversal.wasInFrustum;
    t2 = t2.parent;
  }
  return false;
}
var _i = /* @__PURE__ */ new L4();
var vi = /* @__PURE__ */ new L4();
var yi = /* @__PURE__ */ new ge2();
var bi = /* @__PURE__ */ new ge2();
var xi = /* @__PURE__ */ new L4();
function Si() {
  let e2 = this._fadeManager, t2 = this._fadeMaterialManager, n2 = this._fadingBefore, r2 = this._prevCameraTransforms, { tiles: i3, maximumFadeOutTiles: a3, batchedMesh: o3 } = this, { cameras: s3 } = i3;
  e2.update();
  let c3 = e2.fadeCount;
  if (n2 !== 0 && c3 !== 0 && (i3.dispatchEvent({ type: "fade-change" }), i3.dispatchEvent({ type: "needs-render" })), a3 < this._fadingOutCount) {
    let t3 = true;
    s3.forEach((e3) => {
      if (!r2.has(e3)) return;
      let n3 = e3.matrixWorld, i4 = r2.get(e3);
      n3.decompose(vi, bi, xi), i4.decompose(_i, yi, xi);
      let a4 = bi.angleTo(yi), o4 = vi.distanceTo(_i);
      t3 && (t3 = a4 > 0.25 || o4 > 0.1);
    }), t3 && e2.completeAllFades();
  }
  if (s3.forEach((e3) => {
    r2.get(e3).copy(e3.matrixWorld);
  }), e2.forEachObject((e3, { fadeIn: n3, fadeOut: r3 }) => {
    let a4 = e3.engineData.scene;
    i3.markTileUsed(e3), a4 && t2.setFade(a4, n3, r3), this.forEachBatchIds(e3, (e4, t3, i4) => {
      t3.setFadeAt(e4, n3, r3), t3.setVisibleAt(e4, true), i4.batchedMesh.setVisibleAt(e4, false);
    });
  }), o3) {
    let e3 = i3.getPluginByName("BATCHED_TILES_PLUGIN").batchedMesh.material;
    o3.material.map = e3.map;
  }
}
var Ci = class {
  get fadeDuration() {
    return this._fadeManager.duration;
  }
  set fadeDuration(e2) {
    this._fadeManager.duration = Number(e2);
  }
  get fadingTiles() {
    return this._fadeManager.fadeCount;
  }
  constructor(e2) {
    e2 = {
      maximumFadeOutTiles: 50,
      fadeRootTiles: false,
      fadeDuration: 250,
      ...e2
    }, this.name = "FADE_TILES_PLUGIN", this.priority = -2, this.tiles = null, this.batchedMesh = null, this._quickFadeTiles = /* @__PURE__ */ new Set(), this._fadeManager = new ci(), this._fadeMaterialManager = new di(), this._prevCameraTransforms = null, this._fadingOutCount = 0, this.maximumFadeOutTiles = e2.maximumFadeOutTiles, this.fadeRootTiles = e2.fadeRootTiles, this.fadeDuration = e2.fadeDuration;
  }
  init(e2) {
    this._onLoadModel = ({ scene: e3 }) => {
      this._fadeMaterialManager.prepareScene(e3);
    }, this._onDisposeModel = ({ tile: e3, scene: t3 }) => {
      this.tiles.visibleTiles.has(e3) && this._quickFadeTiles.add(e3.parent), this._fadeManager.deleteObject(e3), this._fadeMaterialManager.deleteScene(t3);
    }, this._onAddCamera = ({ camera: e3 }) => {
      this._prevCameraTransforms.set(e3, new P4());
    }, this._onDeleteCamera = ({ camera: e3 }) => {
      this._prevCameraTransforms.delete(e3);
    }, this._onTileVisibilityChange = ({ tile: e3 }) => {
      this.forEachBatchIds(e3, (e4, t3, n3) => {
        t3.setFadeAt(e4, 0, 0), t3.setVisibleAt(e4, false), n3.batchedMesh.setVisibleAt(e4, false);
      });
    }, this._onUpdateBefore = () => {
      this._fadingBefore = this._fadeManager.fadeCount;
    }, this._onUpdateAfter = () => {
      Si.call(this);
    }, e2.addEventListener("load-model", this._onLoadModel), e2.addEventListener("dispose-model", this._onDisposeModel), e2.addEventListener("add-camera", this._onAddCamera), e2.addEventListener("delete-camera", this._onDeleteCamera), e2.addEventListener("update-before", this._onUpdateBefore), e2.addEventListener("update-after", this._onUpdateAfter), e2.addEventListener("tile-visibility-change", this._onTileVisibilityChange);
    let t2 = this._fadeManager;
    t2.onFadeSetStart = () => {
      e2.dispatchEvent({ type: "fade-start" }), e2.dispatchEvent({ type: "needs-render" });
    }, t2.onFadeSetComplete = () => {
      e2.dispatchEvent({ type: "fade-end" }), e2.dispatchEvent({ type: "needs-render" });
    }, t2.onFadeComplete = (t3, n3) => {
      this._fadeMaterialManager.setFade(t3.engineData.scene, 0, 0), this.forEachBatchIds(t3, (e3, t4, r2) => {
        t4.setFadeAt(e3, 0, 0), t4.setVisibleAt(e3, false), r2.batchedMesh.setVisibleAt(e3, n3);
      }), n3 || (e2.invokeOnePlugin((e3) => e3 !== this && e3.setTileVisible && e3.setTileVisible(t3, false)), this._fadingOutCount--);
    };
    let n2 = /* @__PURE__ */ new Map();
    e2.cameras.forEach((e3) => {
      n2.set(e3, new P4());
    }), e2.forEachLoadedModel((e3, t3) => {
      this._onLoadModel({ scene: e3 });
    }), this.tiles = e2, this._fadeManager = t2, this._prevCameraTransforms = n2;
  }
  initBatchedMesh() {
    let e2 = this.tiles.getPluginByName("BATCHED_TILES_PLUGIN")?.batchedMesh;
    if (e2) {
      if (this.batchedMesh === null) {
        this._onBatchedMeshDispose = () => {
          this.batchedMesh.dispose(), this.batchedMesh.removeFromParent(), this.batchedMesh = null, e2.removeEventListener("dispose", this._onBatchedMeshDispose);
        };
        let t2 = e2.material.clone();
        t2.onBeforeCompile = e2.material.onBeforeCompile, this.batchedMesh = new pi(e2, t2), this.tiles.group.add(this.batchedMesh);
      }
    } else this.batchedMesh !== null && (this._onBatchedMeshDispose(), this._onBatchedMeshDispose = null);
  }
  setTileVisible(e2, t2) {
    let n2 = this._fadeManager, r2 = n2.isFading(e2);
    if (!gi(e2)) return r2 && n2.completeFade(e2), false;
    if (n2.isFadingOut(e2) && this._fadingOutCount--, t2 ? e2.internal.depthFromRenderedParent === 1 ? ((e2[hi] || this.fadeRootTiles) && this._fadeManager.fadeIn(e2), e2[hi] = true) : this._fadeManager.fadeIn(e2) : (this._fadingOutCount++, n2.fadeOut(e2)), this._quickFadeTiles.has(e2) && (this._fadeManager.completeFade(e2), this._quickFadeTiles.delete(e2)), r2) return true;
    let i3 = this._fadeManager.isFading(e2);
    return !!(!t2 && i3);
  }
  dispose() {
    let e2 = this.tiles;
    this._fadeManager.completeAllFades(), this.batchedMesh !== null && this._onBatchedMeshDispose(), e2.removeEventListener("load-model", this._onLoadModel), e2.removeEventListener("dispose-model", this._onDisposeModel), e2.removeEventListener("add-camera", this._onAddCamera), e2.removeEventListener("delete-camera", this._onDeleteCamera), e2.removeEventListener("update-before", this._onUpdateBefore), e2.removeEventListener("update-after", this._onUpdateAfter), e2.removeEventListener("tile-visibility-change", this._onTileVisibilityChange), e2.forEachLoadedModel((e3, t2) => {
      this._fadeManager.deleteObject(t2);
    });
  }
  forEachBatchIds(e2, t2) {
    if (this.initBatchedMesh(), this.batchedMesh) {
      let n2 = this.tiles.getPluginByName("BATCHED_TILES_PLUGIN"), r2 = n2.getTileBatchIds(e2);
      r2 && r2.forEach((e3) => {
        t2(e3, this.batchedMesh, n2);
      });
    }
  }
};
var wi = /* @__PURE__ */ new P4();
var Ti = /* @__PURE__ */ new L4();
var Ei = /* @__PURE__ */ new L4();
var Di = class extends g4 {
  constructor(...e2) {
    super(...e2), this.resetDistance = 1e4, this._matricesTextureHandle = null, this._lastCameraPos = new P4(), this._forceUpdate = true, this._matrices = [];
  }
  setMatrixAt(e2, t2) {
    super.setMatrixAt(e2, t2), this._forceUpdate = true;
    let n2 = this._matrices;
    for (; n2.length <= e2; ) n2.push(new P4());
    n2[e2].copy(t2);
  }
  setInstanceCount(...e2) {
    super.setInstanceCount(...e2);
    let t2 = this._matrices;
    for (; t2.length > this.instanceCount; ) t2.pop();
  }
  onBeforeRender(e2, t2, n2, r2, i3, a3) {
    super.onBeforeRender(e2, t2, n2, r2, i3, a3), Ti.setFromMatrixPosition(n2.matrixWorld), Ei.setFromMatrixPosition(this._lastCameraPos);
    let o3 = this._matricesTexture, s3 = this._modelViewMatricesTexture;
    if ((!s3 || s3.image.width !== o3.image.width || s3.image.height !== o3.image.height) && (s3 && s3.dispose(), s3 = o3.clone(), s3.source = new Te2({
      ...s3.image,
      data: s3.image.data.slice()
    }), this._modelViewMatricesTexture = s3), this._forceUpdate || Ti.distanceTo(Ei) > this.resetDistance) {
      let e3 = this._matrices, t3 = s3.image.data;
      for (let r3 = 0; r3 < this.maxInstanceCount; r3++) {
        let i4 = e3[r3];
        i4 ? wi.copy(i4) : wi.identity(), wi.premultiply(this.matrixWorld).premultiply(n2.matrixWorldInverse).toArray(t3, r3 * 16);
      }
      s3.needsUpdate = true, this._lastCameraPos.copy(n2.matrixWorld), this._forceUpdate = false;
    }
    this._matricesTextureHandle = this._matricesTexture, this._matricesTexture = this._modelViewMatricesTexture, this.matrixWorld.copy(this._lastCameraPos);
  }
  onAfterRender() {
    this.updateMatrixWorld(), this._matricesTexture = this._matricesTextureHandle, this._matricesTextureHandle = null;
  }
  onAfterShadow(e2, t2, n2, r2, i3, a3) {
    this.onAfterRender(e2, null, r2, i3, a3);
  }
  dispose() {
    super.dispose(), this._modelViewMatricesTexture && this._modelViewMatricesTexture.dispose();
  }
};
var q4 = /* @__PURE__ */ new ce3();
var Oi = [];
var ki = class extends Di {
  constructor(...e2) {
    super(...e2), this.expandPercent = 0.25, this.maxInstanceExpansionSize = Infinity, this._freeGeometryIds = [];
  }
  findFreeId(e2, t2, n2) {
    let r2 = !!this.geometry.index, i3 = Math.max(r2 ? e2.index.count : -1, n2), a3 = Math.max(e2.attributes.position.count, t2), o3 = -1, s3 = Infinity, c3 = this._freeGeometryIds;
    if (c3.forEach((e3, t3) => {
      let { reservedIndexCount: n3, reservedVertexCount: r3 } = this.getGeometryRangeAt(e3);
      if (n3 >= i3 && r3 >= a3) {
        let e4 = i3 - n3 + (a3 - r3);
        e4 < s3 && (o3 = t3, s3 = e4);
      }
    }), o3 !== -1) {
      let e3 = c3[o3];
      return c3.splice(o3, 1), e3;
    } else return -1;
  }
  addGeometry(e2, t2, n2) {
    let r2 = !!this.geometry.index;
    n2 = Math.max(r2 ? e2.index.count : -1, n2), t2 = Math.max(e2.attributes.position.count, t2);
    let { expandPercent: i3, _freeGeometryIds: a3 } = this, o3 = this.findFreeId(e2, t2, n2);
    if (o3 !== -1) this.setGeometryAt(o3, e2);
    else {
      let r3 = () => {
        let e3 = this.unusedVertexCount < t2, r4 = this.unusedIndexCount < n2;
        return e3 || r4;
      }, s3 = e2.index, c3 = e2.attributes.position;
      if (t2 = Math.max(t2, c3.count), n2 = Math.max(n2, s3 ? s3.count : 0), r3() && (a3.forEach((e3) => this.deleteGeometry(e3)), a3.length = 0, this.optimize(), r3())) {
        let e3 = this.geometry.index, r4 = this.geometry.attributes.position, a4, o4;
        if (e3) {
          let t3 = Math.ceil(i3 * e3.count);
          a4 = Math.max(t3, n2, s3.count) + e3.count;
        } else a4 = Math.max(this.unusedIndexCount, n2);
        if (r4) {
          let e4 = Math.ceil(i3 * r4.count);
          o4 = Math.max(e4, t2, c3.count) + r4.count;
        } else o4 = Math.max(this.unusedVertexCount, t2);
        this.setGeometrySize(o4, a4);
      }
      o3 = super.addGeometry(e2, t2, n2);
    }
    return o3;
  }
  addInstance(e2) {
    if (this.maxInstanceCount === this.instanceCount) {
      let e3 = Math.ceil(this.maxInstanceCount * (1 + this.expandPercent));
      this.setInstanceCount(Math.min(e3, this.maxInstanceExpansionSize));
    }
    return super.addInstance(e2);
  }
  deleteInstance(e2) {
    let t2 = this.getGeometryIdAt(e2);
    return t2 !== -1 && this._freeGeometryIds.push(t2), super.deleteInstance(e2);
  }
  raycastInstance(e2, t2, n2) {
    let r2 = this.geometry, i3 = this.getGeometryIdAt(e2);
    q4.material = this.material, q4.geometry.index = r2.index, q4.geometry.attributes = r2.attributes;
    let a3 = this.getGeometryRangeAt(i3);
    q4.geometry.setDrawRange(a3.start, a3.count), q4.geometry.boundingBox === null && (q4.geometry.boundingBox = new v5()), q4.geometry.boundingSphere === null && (q4.geometry.boundingSphere = new Ee2()), this.getMatrixAt(e2, q4.matrixWorld).premultiply(this.matrixWorld), this.getBoundingBoxAt(i3, q4.geometry.boundingBox), this.getBoundingSphereAt(i3, q4.geometry.boundingSphere), q4.raycast(t2, Oi);
    for (let t3 = 0, r3 = Oi.length; t3 < r3; t3++) {
      let r4 = Oi[t3];
      r4.object = this, r4.batchId = e2, n2.push(r4);
    }
    Oi.length = 0;
  }
};
function Ai(e2) {
  return e2.r === 1 && e2.g === 1 && e2.b === 1;
}
function ji(e2) {
  e2.needsUpdate = true, e2.onBeforeCompile = (e3) => {
    e3.vertexShader = e3.vertexShader.replace("#include <common>", "\n				#include <common>\n				varying float texture_index;\n				").replace("#include <uv_vertex>", "\n				#include <uv_vertex>\n				texture_index = getIndirectIndex( gl_DrawID );\n				"), e3.fragmentShader = e3.fragmentShader.replace("#include <map_pars_fragment>", "\n				#ifdef USE_MAP\n				precision highp sampler2DArray;\n				uniform sampler2DArray map;\n				varying float texture_index;\n				#endif\n				").replace("#include <map_fragment>", "\n				#ifdef USE_MAP\n					diffuseColor *= texture( map, vec3( vMapUv, texture_index ) );\n				#endif\n				");
  };
}
var Mi = new Re2(new F4());
var Ni = new E4(new Uint8Array([
  255,
  255,
  255,
  255
]), 1, 1);
Ni.needsUpdate = true;
var Pi = /* @__PURE__ */ new P4();
var Fi = class {
  constructor(e2 = {}) {
    if (parseInt(_e2) < 170) throw Error("BatchedTilesPlugin: Three.js revision 170 or higher required.");
    e2 = {
      instanceCount: 500,
      vertexCount: 750,
      indexCount: 2e3,
      expandPercent: 0.25,
      maxInstanceCount: Infinity,
      discardOriginalContent: true,
      textureSize: null,
      material: null,
      renderer: null,
      ...e2
    }, this.name = "BATCHED_TILES_PLUGIN", this.priority = -1;
    let t2 = e2.renderer.getContext();
    this.instanceCount = e2.instanceCount, this.vertexCount = e2.vertexCount, this.indexCount = e2.indexCount, this.material = e2.material ? e2.material.clone() : null, this.expandPercent = e2.expandPercent, this.maxInstanceCount = Math.min(e2.maxInstanceCount, t2.getParameter(t2.MAX_3D_TEXTURE_SIZE)), this.renderer = e2.renderer, this.discardOriginalContent = e2.discardOriginalContent, this.textureSize = e2.textureSize, this.batchedMesh = null, this.arrayTarget = null, this.tiles = null, this._tileToInstanceId = /* @__PURE__ */ new Map();
  }
  init(e2) {
    this.tiles = e2;
  }
  initTextureArray(e2) {
    if (this.arrayTarget !== null || e2.material.map === null) return;
    let { instanceCount: t2, renderer: n2, textureSize: r2, batchedMesh: i3 } = this, a3 = e2.material.map, o3 = {
      colorSpace: a3.colorSpace,
      wrapS: a3.wrapS,
      wrapT: a3.wrapT,
      wrapR: a3.wrapS,
      magFilter: a3.magFilter
    }, s3 = new Ne2(r2 || a3.image.width, r2 || a3.image.height, t2);
    Object.assign(s3.texture, o3), n2.initRenderTarget(s3), i3.material.map = s3.texture, this.arrayTarget = s3, this._tileToInstanceId.forEach((e3) => {
      e3.forEach((e4) => {
        this.assignTextureToLayer(Ni, e4);
      });
    });
  }
  initBatchedMesh(e2) {
    if (this.batchedMesh !== null) return;
    let { instanceCount: t2, vertexCount: n2, indexCount: r2, tiles: i3 } = this, a3 = this.material ? this.material : new e2.material.constructor(), o3 = new ki(t2, t2 * n2, t2 * r2, a3);
    o3.name = "BatchTilesPlugin", o3.frustumCulled = false, i3.group.add(o3), o3.updateMatrixWorld(), ji(o3.material), this.batchedMesh = o3;
  }
  setTileVisible(e2, t2) {
    let n2 = e2.engineData.scene;
    if (t2 && this.addSceneToBatchedMesh(n2, e2), this._tileToInstanceId.has(e2)) {
      this._tileToInstanceId.get(e2).forEach((e3) => {
        this.batchedMesh.setVisibleAt(e3, t2);
      });
      let r2 = this.tiles;
      return t2 ? r2.visibleTiles.add(e2) : r2.visibleTiles.delete(e2), r2.dispatchEvent({
        type: "tile-visibility-change",
        scene: n2,
        tile: e2,
        visible: t2
      }), true;
    }
    return false;
  }
  disposeTile(e2) {
    this.removeSceneFromBatchedMesh(e2);
  }
  unloadTileFromGPU(e2, t2) {
    return !this.discardOriginalContent && this._tileToInstanceId.has(t2) ? (this.removeSceneFromBatchedMesh(t2), true) : false;
  }
  assignTextureToLayer(e2, t2) {
    if (!this.arrayTarget) return;
    this.expandArrayTargetIfNeeded();
    let { renderer: n2 } = this, r2 = n2.getRenderTarget();
    n2.setRenderTarget(this.arrayTarget, t2), Mi.material.map = e2, Mi.render(n2), n2.setRenderTarget(r2), Mi.material.map = null, e2.dispose();
  }
  expandArrayTargetIfNeeded() {
    let { batchedMesh: e2, arrayTarget: t2, renderer: n2 } = this, r2 = Math.min(e2.maxInstanceCount, this.maxInstanceCount);
    if (r2 > t2.depth) {
      let i3 = {
        colorSpace: t2.texture.colorSpace,
        wrapS: t2.texture.wrapS,
        wrapT: t2.texture.wrapT,
        generateMipmaps: t2.texture.generateMipmaps,
        minFilter: t2.texture.minFilter,
        magFilter: t2.texture.magFilter
      }, a3 = new Ne2(t2.width, t2.height, r2);
      Object.assign(a3.texture, i3), n2.initRenderTarget(a3), n2.copyTextureToTexture(t2.texture, a3.texture), t2.dispose(), e2.material.map = a3.texture, this.arrayTarget = a3;
    }
  }
  removeSceneFromBatchedMesh(e2) {
    if (this._tileToInstanceId.has(e2)) {
      let t2 = this._tileToInstanceId.get(e2);
      this._tileToInstanceId.delete(e2), t2.forEach((e3) => {
        this.batchedMesh.deleteInstance(e3);
      });
    }
  }
  addSceneToBatchedMesh(e2, t2) {
    if (this._tileToInstanceId.has(t2)) return;
    let n2 = [];
    e2.traverse((e3) => {
      e3.isMesh && n2.push(e3);
    });
    let r2 = true;
    n2.forEach((e3) => {
      if (this.batchedMesh && r2) {
        let t3 = e3.geometry.attributes, n3 = this.batchedMesh.geometry.attributes;
        for (let e4 in n3) if (!(e4 in t3)) {
          r2 = false;
          return;
        }
      }
    });
    let i3 = !this.batchedMesh || this.batchedMesh.instanceCount + n2.length <= this.maxInstanceCount;
    if (r2 && i3) {
      e2.updateMatrixWorld();
      let r3 = [];
      this._tileToInstanceId.set(t2, r3), n2.forEach((t3) => {
        this.initBatchedMesh(t3), this.initTextureArray(t3);
        let { geometry: n3, material: i4 } = t3, { batchedMesh: a3, expandPercent: o3 } = this;
        a3.expandPercent = o3;
        let s3 = a3.addGeometry(n3, this.vertexCount, this.indexCount), c3 = a3.addInstance(s3);
        r3.push(c3), Pi.copy(t3.matrixWorld), e2.parent !== null && Pi.premultiply(this.tiles.group.matrixWorldInverse), a3.setMatrixAt(c3, Pi), a3.setVisibleAt(c3, false), Ai(i4.color) || (i4.color.setHSL(Math.random(), 0.5, 0.5), a3.setColorAt(c3, i4.color));
        let l3 = i4.map;
        l3 ? this.assignTextureToLayer(l3, c3) : this.assignTextureToLayer(Ni, c3);
      }), this.discardOriginalContent && (t2.engineData.textures.forEach((e3) => {
        e3.image instanceof ImageBitmap && e3.image.close();
      }), t2.engineData.scene = null, t2.engineData.materials = [], t2.engineData.geometries = [], t2.engineData.textures = []);
    }
  }
  raycastTile(e2, t2, n2, r2) {
    return this._tileToInstanceId.has(e2) ? (this._tileToInstanceId.get(e2).forEach((e3) => {
      this.batchedMesh.raycastInstance(e3, n2, r2);
    }), true) : false;
  }
  dispose() {
    let { arrayTarget: e2, batchedMesh: t2 } = this;
    e2 && e2.dispose(), t2 && (t2.material.dispose(), t2.geometry.dispose(), t2.dispose(), t2.removeFromParent());
  }
  getTileBatchIds(e2) {
    return this._tileToInstanceId.get(e2);
  }
};
var Ii = /* @__PURE__ */ new Ee2();
var Li = /* @__PURE__ */ new L4();
var Ri = /* @__PURE__ */ new P4();
var zi = /* @__PURE__ */ new P4();
var Bi = /* @__PURE__ */ new xe2();
var Vi = /* @__PURE__ */ new F4({ side: O4 });
var Hi = /* @__PURE__ */ new v5();
var Ui = 1e5;
function Wi(e2, t2) {
  return e2.isBufferGeometry ? (e2.boundingSphere === null && e2.computeBoundingSphere(), t2.copy(e2.boundingSphere)) : (Hi.setFromObject(e2), Hi.getBoundingSphere(t2), t2);
}
var Gi = class {
  constructor() {
    this.name = "TILE_FLATTENING_PLUGIN", this.priority = -100, this.tiles = null, this.shapes = /* @__PURE__ */ new Map(), this.positionsMap = /* @__PURE__ */ new Map(), this.positionsUpdated = /* @__PURE__ */ new Set(), this.needsUpdate = false;
  }
  init(e2) {
    this.tiles = e2, this.needsUpdate = true, this._updateBeforeCallback = () => {
      this.needsUpdate && (this.needsUpdate = (this._updateTiles(), false));
    }, this._disposeModelCallback = ({ tile: e3 }) => {
      this.positionsMap.delete(e3), this.positionsUpdated.delete(e3);
    }, e2.addEventListener("update-before", this._updateBeforeCallback), e2.addEventListener("dispose-model", this._disposeModelCallback);
  }
  setTileActive(e2, t2) {
    t2 && !this.positionsUpdated.has(e2) && this._updateTile(e2);
  }
  _updateTile(e2) {
    let { positionsUpdated: t2, positionsMap: n2, shapes: r2, tiles: i3 } = this;
    t2.add(e2);
    let a3 = e2.engineData.scene;
    if (n2.has(e2)) {
      let t3 = n2.get(e2);
      a3.traverse((e3) => {
        if (e3.geometry) {
          let n3 = t3.get(e3.geometry);
          n3 && (e3.geometry.attributes.position.array.set(n3), e3.geometry.attributes.position.needsUpdate = true);
        }
      });
    } else {
      let t3 = /* @__PURE__ */ new Map();
      n2.set(e2, t3), a3.traverse((e3) => {
        e3.geometry && t3.set(e3.geometry, e3.geometry.attributes.position.array.slice());
      });
    }
    a3.updateMatrixWorld(true), a3.traverse((e3) => {
      let { geometry: t3 } = e3;
      t3 && (Ri.copy(e3.matrixWorld), a3.parent !== null && Ri.premultiply(i3.group.matrixWorldInverse), zi.copy(Ri).invert(), Wi(t3, Ii).applyMatrix4(Ri), r2.forEach(({ shape: e4, direction: n3, sphere: r3, thresholdMode: i4, threshold: a4, flattenRange: o3 }) => {
        Li.subVectors(Ii.center, r3.center), Li.addScaledVector(n3, -n3.dot(Li));
        let s3 = (Ii.radius + r3.radius) ** 2;
        if (Li.lengthSq() > s3) return;
        let { position: c3 } = t3.attributes, { ray: l3 } = Bi;
        l3.direction.copy(n3).multiplyScalar(-1);
        for (let t4 = 0, r4 = c3.count; t4 < r4; t4++) {
          l3.origin.fromBufferAttribute(c3, t4).applyMatrix4(Ri).addScaledVector(n3, Ui), Bi.far = Ui;
          let r5 = Bi.intersectObject(e4)[0];
          if (r5) {
            let e5 = (Ui - r5.distance) / a4, n4 = e5 >= 1;
            (!n4 || n4 && i4 === "flatten") && (e5 = Math.min(e5, 1), r5.point.addScaledVector(l3.direction, N4.mapLinear(e5, 0, 1, -o3, 0)), r5.point.applyMatrix4(zi), c3.setXYZ(t4, ...r5.point));
          }
        }
      }));
    }), this.tiles.dispatchEvent({ type: "needs-render" });
  }
  _updateTiles() {
    this.positionsUpdated.clear(), this.tiles.activeTiles.forEach((e2) => this._updateTile(e2));
  }
  hasShape(e2) {
    return this.shapes.has(e2);
  }
  addShape(e2, t2 = new L4(0, 0, -1), n2 = {}) {
    if (this.hasShape(e2)) throw Error("TileFlatteningPlugin: Shape is already used.");
    typeof n2 == "number" && (console.warn('TileFlatteningPlugin: "addShape" function signature has changed. Please use an options object, instead.'), n2 = { threshold: n2 }), this.needsUpdate = true;
    let r2 = e2.clone();
    r2.updateMatrixWorld(true), r2.traverse((e3) => {
      e3.material && (e3.material = Vi);
    });
    let i3 = Wi(r2, new Ee2());
    this.shapes.set(e2, {
      shape: r2,
      direction: t2.clone(),
      sphere: i3,
      thresholdMode: "none",
      threshold: Infinity,
      flattenRange: 0,
      ...n2
    });
  }
  updateShape(e2) {
    if (!this.hasShape(e2)) throw Error("TileFlatteningPlugin: Shape is not present.");
    let { direction: t2, threshold: n2, thresholdMode: r2, flattenRange: i3 } = this.shapes.get(e2);
    this.deleteShape(e2), this.addShape(e2, t2, {
      threshold: n2,
      thresholdMode: r2,
      flattenRange: i3
    });
  }
  deleteShape(e2) {
    return this.needsUpdate = true, this.shapes.delete(e2);
  }
  clearShapes() {
    this.shapes.size !== 0 && (this.needsUpdate = true, this.shapes.clear());
  }
  dispose() {
    this.tiles.removeEventListener("before-update", this._updateBeforeCallback), this.tiles.removeEventListener("dispose-model", this._disposeModelCallback), this.positionsMap.forEach((e2) => {
      e2.forEach((e3, t2) => {
        let { position: n2 } = t2.attributes;
        n2.array.set(e3), n2.needsUpdate = true;
      });
    });
  }
};
var Ki = class {
  constructor(e2 = {}) {
    let { regions: t2 = [] } = e2;
    this.name = "LOAD_REGION_PLUGIN", this.regions = [], this.tiles = null, t2.forEach((e3) => this.addRegion(e3));
  }
  init(e2) {
    this.tiles = e2;
  }
  addRegion(e2) {
    this.regions.indexOf(e2) === -1 && this.regions.push(e2);
  }
  removeRegion(e2) {
    let t2 = this.regions.indexOf(e2);
    t2 !== -1 && this.regions.splice(t2, 1);
  }
  hasRegion(e2) {
    return this.regions.indexOf(e2) !== -1;
  }
  clearRegions() {
    this.regions = [];
  }
  calculateTileViewError(e2, t2) {
    let n2 = e2.engineData.boundingVolume, { regions: r2, tiles: i3 } = this, a3 = false, o3 = null, s3 = 0, c3 = Infinity;
    for (let t3 of r2) {
      let r3 = t3.intersectsTile(n2, e2, i3);
      a3 || (a3 = r3), r3 && (s3 = Math.max(t3.calculateError(e2, i3), s3), c3 = Math.min(t3.calculateDistance(n2, e2, i3), c3)), t3.mask && (o3 || (o3 = r3));
    }
    return t2.inView = a3 && o3 !== false, t2.error = s3, t2.distance = c3, t2.inView || o3 !== null;
  }
  dispose() {
    this.regions = [];
  }
};
var qi = class {
  constructor(e2 = {}) {
    let { errorTarget: t2 = 10, mask: n2 = false } = e2;
    this.errorTarget = t2, this.mask = n2;
  }
  intersectsTile(e2, t2, n2) {
    return false;
  }
  calculateDistance(e2, t2, n2) {
    return Infinity;
  }
  calculateError(e2, t2) {
    return e2.geometricError - this.errorTarget + t2.errorTarget;
  }
};
var Ji = class extends qi {
  constructor(e2 = {}) {
    let { sphere: t2 = new Ee2() } = e2;
    super(e2), this.sphere = t2.clone();
  }
  intersectsTile(e2) {
    return e2.intersectsSphere(this.sphere);
  }
};
var Yi = class extends qi {
  constructor(e2 = {}) {
    let { ray: t2 = new be2() } = e2;
    super(e2), this.ray = t2.clone();
  }
  intersectsTile(e2) {
    return e2.intersectsRay(this.ray);
  }
};
var Xi = class extends qi {
  constructor(e2 = {}) {
    let { obb: t2 = new bt() } = e2;
    super(e2), this.obb = t2.clone(), this.obb.update();
  }
  intersectsTile(e2) {
    return e2.intersectsOBB(this.obb);
  }
};
var J4 = /* @__PURE__ */ new L4();
var Zi = [
  "x",
  "y",
  "z"
];
var Qi = class extends re3 {
  constructor(e2, t2 = 16776960, n2 = 40) {
    let r2 = new S4(), i3 = [];
    for (let e3 = 0; e3 < 3; e3++) {
      let t3 = Zi[e3], r3 = Zi[(e3 + 1) % 3];
      J4.set(0, 0, 0);
      for (let e4 = 0; e4 < n2; e4++) {
        let a3;
        a3 = 2 * Math.PI * e4 / (n2 - 1), J4[t3] = Math.sin(a3), J4[r3] = Math.cos(a3), i3.push(J4.x, J4.y, J4.z), a3 = 2 * Math.PI * (e4 + 1) / (n2 - 1), J4[t3] = Math.sin(a3), J4[r3] = Math.cos(a3), i3.push(J4.x, J4.y, J4.z);
      }
    }
    r2.setAttribute("position", new x5(new Float32Array(i3), 3)), r2.computeBoundingSphere(), super(r2, new ne3({
      color: t2,
      toneMapped: false
    })), this.sphere = e2, this.type = "SphereHelper";
  }
  updateMatrixWorld(e2) {
    let t2 = this.sphere;
    this.position.copy(t2.center), this.scale.setScalar(t2.radius), super.updateMatrixWorld(e2);
  }
};
var $i = /* @__PURE__ */ new L4();
var ea = /* @__PURE__ */ new L4();
var ta = /* @__PURE__ */ new L4();
var Y4 = /* @__PURE__ */ new L4();
var na = /* @__PURE__ */ new L4();
var ra = /* @__PURE__ */ new L4(0, 0, 1);
function ia(e2) {
  e2 = e2.toNonIndexed();
  let { groups: t2 } = e2, { position: n2, normal: r2 } = e2.attributes, i3 = [], a3 = [];
  for (let e3 of t2) {
    let { start: t3, count: o4 } = e3;
    for (let e4 = t3, s3 = t3 + o4; e4 < s3; e4++) Y4.fromBufferAttribute(n2, e4), na.fromBufferAttribute(r2, e4), a3.push(...Y4), i3.push(...na);
  }
  let o3 = new S4();
  return o3.setAttribute("position", new x5(new Float32Array(a3), 3)), o3.setAttribute("normal", new x5(new Float32Array(i3), 3)), o3;
}
function aa(e2, t2 = 32) {
  let { latStart: n2 = -Math.PI / 2, latEnd: r2 = Math.PI / 2, lonStart: i3 = 0, lonEnd: a3 = 2 * Math.PI, heightStart: o3 = 0, heightEnd: s3 = 0 } = e2, c3 = new b5(1, 1, 1, t2, t2), { normal: l3, position: u4 } = c3.attributes;
  for (let t3 = 0, c4 = u4.count; t3 < c4; t3++) {
    ta.fromBufferAttribute(u4, t3);
    let c5 = N4.mapLinear(ta.x, -0.5, 0.5, n2, r2), d5 = N4.mapLinear(ta.y, -0.5, 0.5, i3, a3), f4 = ta.z < 0;
    $i.fromBufferAttribute(l3, t3), e2.getCartographicToPosition(c5, d5, f4 ? s3 : o3, ta), u4.setXYZ(t3, ta.x, ta.y, ta.z), e2.getCartographicToNormal(c5, d5, ea), $i.z === 0 ? (Y4.crossVectors(ra, ea), Y4.lengthSq() < 1e-12 && Y4.set(1, 0, 0), Y4.normalize(), $i.x === 0 ? ea.copy(Y4).multiplyScalar(Math.sign($i.y)) : ea.crossVectors(ea, Y4).normalize().multiplyScalar(Math.sign($i.x))) : ea.multiplyScalar(f4 ? 1 : -1), l3.setXYZ(t3, ea.x, ea.y, ea.z);
  }
  return c3;
}
function oa(e2, t2 = 32) {
  let { latStart: n2 = -Math.PI / 2, latEnd: r2 = Math.PI / 2, lonStart: i3 = 0, lonEnd: a3 = 2 * Math.PI, heightStart: o3 = 0, heightEnd: s3 = 0 } = e2, c3 = [], l3 = (n3, r3, i4, a4, o4, s4) => {
    for (let l4 = 0; l4 < t2; l4++) {
      let u5 = l4 / t2, d5 = (l4 + 1) / t2;
      e2.getCartographicToPosition(N4.lerp(n3, a4, u5), N4.lerp(r3, o4, u5), N4.lerp(i4, s4, u5), Y4), e2.getCartographicToPosition(N4.lerp(n3, a4, d5), N4.lerp(r3, o4, d5), N4.lerp(i4, s4, d5), na), c3.push(Y4.x, Y4.y, Y4.z, na.x, na.y, na.z);
    }
  };
  for (let e3 of [o3, s3]) l3(n2, i3, e3, n2, a3, e3), l3(r2, i3, e3, r2, a3, e3), l3(n2, i3, e3, r2, i3, e3), l3(n2, a3, e3, r2, a3, e3);
  for (let e3 of [n2, r2]) for (let t3 of [i3, a3]) l3(e3, t3, o3, e3, t3, s3);
  let u4 = new S4();
  return u4.setAttribute("position", new x5(new Float32Array(c3), 3)), u4;
}
var sa = class extends re3 {
  constructor(e2 = new kt(), t2 = 16776960) {
    super(), this.ellipsoidRegion = e2, this.material.color.set(t2), this.update();
  }
  update() {
    this.geometry.dispose(), this.geometry = oa(this.ellipsoidRegion);
  }
  dispose() {
    this.geometry.dispose(), this.material.dispose();
  }
};
var ca = class extends ce3 {
  constructor(e2 = new kt(), t2 = 16776960) {
    super(), this.ellipsoidRegion = e2, this.material.color.set(t2), this.update();
  }
  update() {
    this.geometry.dispose();
    let e2 = aa(this.ellipsoidRegion), { lonStart: t2, lonEnd: n2 } = this;
    n2 - t2 >= 2 * Math.PI ? (e2.groups.splice(2, 2), this.geometry = ia(e2)) : this.geometry = e2;
  }
  dispose() {
    this.geometry.dispose(), this.material.dispose();
  }
};
var la = Symbol("ORIGINAL_MATERIAL");
var ua = Symbol("HAS_RANDOM_COLOR");
var da = Symbol("HAS_RANDOM_NODE_COLOR");
var fa = Symbol("LOAD_TIME");
var pa = Symbol("PARENT_BOUND_REF_COUNT");
var ma = /* @__PURE__ */ new Ee2();
var ha = () => {
};
var ga = {};
function _a3(e2) {
  if (!ga[e2]) {
    let t2 = Math.random(), n2 = 0.5 + Math.random() * 0.5, r2 = 0.375 + Math.random() * 0.25;
    ga[e2] = new w4().setHSL(t2, n2, r2);
  }
  return ga[e2];
}
var va = 0;
var ya = 1;
var ba = 2;
var xa = 3;
var Sa = 4;
var Ca = 5;
var wa = 6;
var Ta = 7;
var Ea = 8;
var Da = 9;
var Oa = 10;
var ka = 11;
var Aa = Object.freeze({
  NONE: va,
  SCREEN_ERROR: ya,
  GEOMETRIC_ERROR: ba,
  DISTANCE: xa,
  DEPTH: Sa,
  RELATIVE_DEPTH: Ca,
  IS_LEAF: wa,
  RANDOM_COLOR: Ta,
  RANDOM_NODE_COLOR: Ea,
  CUSTOM_COLOR: Da,
  LOAD_ORDER: Oa,
  INDEXED_COLOR: ka
});
var ja = class {
  static get ColorModes() {
    return Aa;
  }
  get wireframe() {
    return this._wireframe;
  }
  set wireframe(e2) {
    e2 !== this._wireframe && (this._wireframe = e2, this.materialsNeedUpdate = true);
  }
  get unlit() {
    return this._unlit;
  }
  set unlit(e2) {
    e2 !== this._unlit && (this._unlit = e2, this.materialsNeedUpdate = true);
  }
  get colorMode() {
    return this._colorMode;
  }
  set colorMode(e2) {
    e2 !== this._colorMode && (this._colorMode = e2, this.materialsNeedUpdate = true);
  }
  get boundsColorMode() {
    return this._boundsColorMode;
  }
  set boundsColorMode(e2) {
    e2 !== this._boundsColorMode && (this._boundsColorMode = e2, this.materialsNeedUpdate = true);
  }
  get enabled() {
    return this._enabled;
  }
  set enabled(e2) {
    e2 !== this._enabled && this.tiles !== null && (this._enabled = e2, e2 ? this.init(this.tiles) : this.dispose());
  }
  get displayParentBounds() {
    return this._displayParentBounds;
  }
  set displayParentBounds(e2) {
    this._displayParentBounds !== e2 && (this._displayParentBounds = e2, e2 ? this.tiles.traverse((e3) => {
      e3.traversal && e3.traversal.visible && this._onTileVisibilityChange(e3, true);
    }, null, false) : this.tiles.traverse((e3) => {
      e3.traversal && (e3[pa] = null, this._onTileVisibilityChange(e3, e3.traversal.visible));
    }, null, false));
  }
  constructor(e2) {
    e2 = {
      displayParentBounds: false,
      displayBoxBounds: false,
      displaySphereBounds: false,
      displayRegionBounds: false,
      colorMode: va,
      boundsColorMode: va,
      maxDebugDepth: -1,
      maxDebugDistance: -1,
      maxDebugError: -1,
      customColorCallback: null,
      unlit: false,
      wireframe: false,
      enabled: true,
      ...e2
    }, this.name = "DEBUG_TILES_PLUGIN", this.tiles = null, this._colorMode = null, this._boundsColorMode = null, this._unlit = null, this._wireframe = null, this.materialsNeedUpdate = false, this.extremeDebugDepth = -1, this.extremeDebugError = -1, this.boxGroup = null, this.sphereGroup = null, this.regionGroup = null, this._enabled = e2.enabled, this._displayParentBounds = e2.displayParentBounds, this.displayBoxBounds = e2.displayBoxBounds, this.displaySphereBounds = e2.displaySphereBounds, this.displayRegionBounds = e2.displayRegionBounds, this.colorMode = e2.colorMode, this.boundsColorMode = e2.boundsColorMode, this.maxDebugDepth = e2.maxDebugDepth, this.maxDebugDistance = e2.maxDebugDistance, this.maxDebugError = e2.maxDebugError, this.customColorCallback = e2.customColorCallback, this.unlit = e2.unlit, this.wireframe = e2.wireframe, this.getDebugColor = (e3, t2) => {
      t2.setRGB(e3, e3, e3);
    };
  }
  init(e2) {
    if (this.tiles = e2, !this.enabled) return;
    let t2 = e2.group;
    this.boxGroup = new te3(), this.boxGroup.name = "DebugTilesRenderer.boxGroup", t2.add(this.boxGroup), this.boxGroup.updateMatrixWorld(), this.sphereGroup = new te3(), this.sphereGroup.name = "DebugTilesRenderer.sphereGroup", t2.add(this.sphereGroup), this.sphereGroup.updateMatrixWorld(), this.regionGroup = new te3(), this.regionGroup.name = "DebugTilesRenderer.regionGroup", t2.add(this.regionGroup), this.regionGroup.updateMatrixWorld(), this._onLoadTilesetCB = () => {
      this._initExtremes();
    }, this._onLoadModelCB = ({ scene: e3, tile: t3 }) => {
      this._onLoadModel(e3, t3);
    }, this._onDisposeModelCB = ({ tile: e3 }) => {
      this._onDisposeModel(e3);
    }, this._onUpdateAfterCB = () => {
      this.update();
    }, this._onTileVisibilityChangeCB = ({ scene: e3, tile: t3, visible: n2 }) => {
      this._onTileVisibilityChange(t3, n2);
    }, e2.addEventListener("load-tileset", this._onLoadTilesetCB), e2.addEventListener("load-model", this._onLoadModelCB), e2.addEventListener("dispose-model", this._onDisposeModelCB), e2.addEventListener("update-after", this._onUpdateAfterCB), e2.addEventListener("tile-visibility-change", this._onTileVisibilityChangeCB), this._initExtremes(), e2.traverse((e3) => {
      e3.engineData.scene && this._onLoadModel(e3.engineData.scene, e3);
    }), e2.visibleTiles.forEach((e3) => {
      this._onTileVisibilityChange(e3, true);
    });
  }
  getTileFromObject3D(e2) {
    let t2 = null;
    return this.tiles.activeTiles.forEach((n2) => {
      if (t2) return;
      let r2 = n2.engineData.scene;
      r2 && r2.traverse((r3) => {
        r3 === e2 && (t2 = n2);
      });
    }), t2;
  }
  setEmptyTileVisible(e2, t2) {
    this._onTileVisibilityChange(e2, t2);
  }
  _initExtremes() {
    if (!(this.tiles && this.tiles.root)) return;
    let e2 = -1, t2 = -1;
    this.tiles.traverse(null, (n2, r2, i3) => {
      e2 = Math.max(e2, i3), t2 = Math.max(t2, n2.geometricError);
    }, false), this.extremeDebugDepth = e2, this.extremeDebugError = t2;
  }
  update() {
    let { tiles: e2, colorMode: t2, boundsColorMode: n2 } = this;
    if (!e2.root) return;
    this.materialsNeedUpdate && (this.materialsNeedUpdate = (e2.forEachLoadedModel((e3) => {
      this._updateMaterial(e3);
    }), false)), this.boxGroup.visible = this.displayBoxBounds, this.sphereGroup.visible = this.displaySphereBounds, this.regionGroup.visible = this.displayRegionBounds;
    let r2 = -1;
    r2 = this.maxDebugDepth === -1 ? this.extremeDebugDepth : this.maxDebugDepth;
    let i3 = -1;
    i3 = this.maxDebugError === -1 ? this.extremeDebugError : this.maxDebugError;
    let a3 = -1;
    this.maxDebugDistance === -1 ? (e2.getBoundingSphere(ma), a3 = ma.radius) : a3 = this.maxDebugDistance;
    let { errorTarget: o3, visibleTiles: s3 } = e2, c3;
    (t2 === Oa || n2 === Oa) && (c3 = Array.from(s3).sort((e3, t3) => e3[fa] - t3[fa]));
    let l3 = (e3, t3, n3, s4, l4, u5) => {
      switch (e3 !== Ta && delete n3.material[ua], e3 !== Ea && delete n3.material[da], e3) {
        case Sa: {
          let e4 = t3.internal.depth / r2;
          this.getDebugColor(e4, n3.material.color);
          break;
        }
        case Ca: {
          let e4 = t3.internal.depthFromRenderedParent / r2;
          this.getDebugColor(e4, n3.material.color);
          break;
        }
        case ya: {
          let e4 = t3.traversal.error / o3;
          e4 > 1 ? n3.material.color.setRGB(1, 0, 0) : this.getDebugColor(e4, n3.material.color);
          break;
        }
        case ba: {
          let e4 = Math.min(t3.geometricError / i3, 1);
          this.getDebugColor(e4, n3.material.color);
          break;
        }
        case xa: {
          let e4 = Math.min(t3.traversal.distanceFromCamera / a3, 1);
          this.getDebugColor(e4, n3.material.color);
          break;
        }
        case wa:
          !t3.children || t3.children.length === 0 ? this.getDebugColor(1, n3.material.color) : this.getDebugColor(0, n3.material.color);
          break;
        case Ea:
          n3.material[da] || (n3.material.color.setHSL(s4, l4, u5), n3.material[da] = true);
          break;
        case Ta:
          n3.material[ua] || (n3.material.color.setHSL(s4, l4, u5), n3.material[ua] = true);
          break;
        case Da:
          this.customColorCallback ? this.customColorCallback(t3, n3) : console.warn("DebugTilesRenderer: customColorCallback not defined");
          break;
        case Oa: {
          let e4 = c3.indexOf(t3);
          this.getDebugColor(e4 / (c3.length - 1), n3.material.color);
          break;
        }
        case ka:
          n3.material.color.copy(_a3(t3.internal.depth)), delete n3.material[ua], delete n3.material[da];
          break;
      }
    };
    s3.forEach((e3) => {
      let n3 = e3.engineData.scene, r3, i4, a4;
      t2 === Ta && (r3 = Math.random(), i4 = 0.5 + Math.random() * 0.5, a4 = 0.375 + Math.random() * 0.25), n3.traverse((n4) => {
        t2 === Ea && (r3 = Math.random(), i4 = 0.5 + Math.random() * 0.5, a4 = 0.375 + Math.random() * 0.25), n4.material && l3(t2, e3, n4, r3, i4, a4);
      });
    });
    let u4 = n2 === va ? ka : n2, d5 = [
      this.boxGroup,
      this.sphereGroup,
      this.regionGroup
    ];
    for (let e3 of d5) for (let t3 of e3.children) {
      let e4 = t3.userData.tile, n3, r3, i4;
      u4 === Ta && (n3 = Math.random(), r3 = 0.5 + Math.random() * 0.5, i4 = 0.375 + Math.random() * 0.25), t3.traverse((t4) => {
        u4 === Ea && (n3 = Math.random(), r3 = 0.5 + Math.random() * 0.5, i4 = 0.375 + Math.random() * 0.25), t4.material && l3(u4, e4, t4, n3, r3, i4);
      });
    }
  }
  _onTileVisibilityChange(e2, t2) {
    this.displayParentBounds ? I(e2, (n2) => {
      n2[pa] ?? (n2[pa] = 0), t2 ? n2[pa]++ : n2[pa] > 0 && n2[pa]--;
      let r2 = n2 === e2 && t2 || this.displayParentBounds && n2[pa] > 0;
      this._updateBoundHelper(n2, r2);
    }) : this._updateBoundHelper(e2, t2);
  }
  _createBoundHelper(e2) {
    let t2 = this.tiles, n2 = e2.engineData, { sphere: r2, obb: i3, region: a3 } = n2.boundingVolume;
    if (i3) {
      let r3 = new te3();
      r3.name = "DebugTilesRenderer.boxHelperGroup", r3.matrix.copy(i3.transform), r3.matrixAutoUpdate = false, r3.userData.tile = e2, n2.boxHelperGroup = r3;
      let a4 = new y5(i3.box, _a3(e2.internal.depth));
      a4.raycast = ha, r3.add(a4);
      let o3 = new ce3(new b5(), new F4({
        color: _a3(e2.internal.depth),
        transparent: true,
        depthWrite: false,
        opacity: 0.05,
        side: O4
      }));
      i3.box.getSize(o3.scale), o3.raycast = ha, r3.add(o3), t2.visibleTiles.has(e2) && this.displayBoxBounds && (this.boxGroup.add(r3), r3.updateMatrixWorld(true));
    }
    if (r2) {
      let i4 = new Qi(r2, _a3(e2.internal.depth));
      i4.raycast = ha, i4.userData.tile = e2;
      let a4 = new ce3(new De2(1), new F4({
        color: _a3(e2.internal.depth),
        transparent: true,
        depthWrite: false,
        opacity: 0.05,
        side: O4
      }));
      a4.raycast = ha, i4.add(a4), n2.sphereHelper = i4, t2.visibleTiles.has(e2) && this.displaySphereBounds && (this.sphereGroup.add(i4), i4.updateMatrixWorld(true));
    }
    if (a3) {
      let r3 = new sa(a3, _a3(e2.internal.depth));
      r3.raycast = ha, r3.userData.tile = e2;
      let i4 = new ca(a3, _a3(e2.internal.depth));
      i4.material.transparent = true, i4.material.depthWrite = false, i4.material.opacity = 0.05, i4.material.side = O4, i4.raycast = ha, r3.add(i4);
      let o3 = new Ee2();
      a3.getBoundingSphere(o3), r3.position.copy(o3.center), o3.center.multiplyScalar(-1), r3.geometry.translate(...o3.center), i4.geometry.translate(...o3.center), n2.regionHelper = r3, t2.visibleTiles.has(e2) && this.displayRegionBounds && (this.regionGroup.add(r3), r3.updateMatrixWorld(true));
    }
  }
  _updateHelperMaterials(e2, t2) {
    t2.traverse((t3) => {
      let { material: n2 } = t3;
      if (!n2) return;
      e2.traversal.visible || !this.displayParentBounds ? n2.opacity = t3.isMesh ? 0.05 : 1 : n2.opacity = t3.isMesh ? 0.01 : 0.2;
      let r2 = n2.transparent;
      n2.transparent = n2.opacity < 1, n2.transparent !== r2 && (n2.needsUpdate = true);
    });
  }
  _updateBoundHelper(e2, t2) {
    let n2 = e2.engineData;
    if (!n2) return;
    let r2 = this.sphereGroup, i3 = this.boxGroup, a3 = this.regionGroup;
    t2 && n2.boxHelperGroup == null && n2.sphereHelper == null && n2.regionHelper == null && this._createBoundHelper(e2);
    let o3 = n2.boxHelperGroup, s3 = n2.sphereHelper, c3 = n2.regionHelper;
    t2 ? (o3 && (i3.add(o3), o3.updateMatrixWorld(true), this._updateHelperMaterials(e2, o3)), s3 && (r2.add(s3), s3.updateMatrixWorld(true), this._updateHelperMaterials(e2, s3)), c3 && (a3.add(c3), c3.updateMatrixWorld(true), this._updateHelperMaterials(e2, c3))) : (o3 && i3.remove(o3), s3 && r2.remove(s3), c3 && a3.remove(c3));
  }
  _updateMaterial(e2) {
    let { colorMode: t2, unlit: n2, wireframe: r2 } = this;
    e2.traverse((e3) => {
      if (!e3.material) return;
      let i3 = e3.material, a3 = e3[la];
      if (i3 !== a3 && i3.dispose(), t2 !== va || n2) {
        if (e3.isPoints) {
          let t3 = new he2();
          t3.size = a3.size, t3.sizeAttenuation = a3.sizeAttenuation, e3.material = t3;
        } else n2 ? e3.material = new F4({ wireframe: r2 }) : (e3.material = new ue3({ wireframe: r2 }), e3.material.flatShading = true);
        t2 === va && (e3.material.map = a3.map, e3.material.color.set(a3.color));
      } else e3.material = a3;
    });
  }
  _onLoadModel(e2, t2) {
    t2[fa] = performance.now(), e2.traverse((e3) => {
      let t3 = e3.material;
      t3 && (e3[la] = t3);
    }), this._updateMaterial(e2);
  }
  _onDisposeModel(e2) {
    let t2 = e2.engineData;
    t2?.boxHelperGroup && (t2.boxHelperGroup.traverse((e3) => {
      e3.geometry && (e3.geometry.dispose(), e3.material.dispose());
    }), delete t2.boxHelperGroup), t2?.sphereHelper && (t2.sphereHelper.traverse((e3) => {
      e3.geometry && (e3.geometry.dispose(), e3.material.dispose());
    }), delete t2.sphereHelper), t2?.regionHelper && (t2.regionHelper.traverse((e3) => {
      e3.geometry && (e3.geometry.dispose(), e3.material.dispose());
    }), delete t2.regionHelper);
  }
  dispose() {
    let e2 = this.tiles;
    e2.removeEventListener("load-tileset", this._onLoadTilesetCB), e2.removeEventListener("load-model", this._onLoadModelCB), e2.removeEventListener("dispose-model", this._onDisposeModelCB), e2.removeEventListener("update-after", this._onUpdateAfterCB), e2.removeEventListener("tile-visibility-change", this._onTileVisibilityChangeCB), this.colorMode = va, this.boundsColorMode = va, this.unlit = false, e2.forEachLoadedModel((e3) => {
      this._updateMaterial(e3);
    }), e2.traverse((e3) => {
      this._onDisposeModel(e3);
    }, null, false), this.boxGroup?.removeFromParent(), this.sphereGroup?.removeFromParent(), this.regionGroup?.removeFromParent();
  }
};
var Ma = 0;
var Na = 1;
var Pa = 2;
var Fa = 3;
var Ia = 150;
function La(e2, t2) {
  return e2 * 1 | t2 * 2;
}
function Ra(e2, t2, n2) {
  return `${e2}_${t2}_${n2}`;
}
var za = class {
  constructor() {
    this.parent = null, this.x = 0, this.y = 0, this.level = 0, this.children = [
      ,
      ,
      ,
      ,
    ].fill(null), this.childCount = 0, this.loadingState = Ma, this.visible = false, this.target = 0, this.showTimer = 0, this.hideTimer = 0, this.siblingForced = false, this.forced = false, this.prefetch = 0, this._key = null, this._index = null;
  }
  getKey() {
    return this._key === null && (this._key = `${this.x}_${this.y}_${this.level}`), this._key;
  }
  getIndex() {
    return this._index === null && (this._index = La(this.x % 2, this.y % 2)), this._index;
  }
  addChild(e2) {
    let t2 = e2.getIndex();
    if (this.children[t2] || e2.x >> 1 !== this.x || e2.y >> 1 !== this.y || e2.level - 1 !== this.level) throw Error();
    e2.parent = this, this.children[t2] = e2, this.childCount++;
  }
  remove() {
    if (this.childCount > 0) throw Error();
    this.parent.childCount--, this.parent.children[this.getIndex()] = null, this.parent = null;
  }
};
var Ba = /* @__PURE__ */ new Set();
var Va = class extends k4 {
  constructor() {
    super(), this.root = new za(), this.cache = { [this.root.getKey()]: this.root }, this.contentCache = null, this._lastTime = -1, this.loadSiblings = true;
  }
  update() {
    let e2 = performance.now(), t2 = e2 - (this._lastTime === -1 ? e2 : this._lastTime);
    this._lastTime = e2;
    let { root: n2 } = this, r2 = this;
    i3(n2), a3(n2), Ba.forEach((e3) => this._deleteTile(e3)), Ba.clear();
    function i3(e3) {
      let n3 = e3.target > 0 || e3.siblingForced, a4 = e3.visible && e3.forced;
      n3 || a4 ? (e3.showTimer += t2, e3.showTimer = Math.min(e3.showTimer, Ia), e3.showTimer === Ia && (e3.hideTimer = 0)) : (e3.visible || e3.showTimer > 0) && (e3.hideTimer += t2, e3.hideTimer = Math.min(e3.hideTimer, Ia), e3.hideTimer === Ia && (e3.showTimer = 0, e3.hideTimer = 0, e3.loadingState !== Ma && e3.prefetch === 0 && (r2.contentCache.release(e3.x, e3.y, e3.level), e3.loadingState = Ma)));
      let o3 = (n3 ? e3.showTimer === Ia : e3.showTimer > 0) || a4;
      if (!n3 && !a4 && e3.prefetch === 0 && e3.showTimer === 0 && e3.loadingState !== Ma && (r2.contentCache.release(e3.x, e3.y, e3.level), e3.loadingState = Ma), (o3 || e3.prefetch > 0) && e3.loadingState === Ma) {
        e3.loadingState = Na;
        let { x: t3, y: n4, level: i4 } = e3, a5 = r2.contentCache.lock(t3, n4, i4);
        a5 instanceof Promise ? a5.then((t4) => {
          e3.loadingState === Na && (e3.loadingState = Pa);
        }).catch((t4) => {
          e3.loadingState === Na && (e3.loadingState = t4.name === "AbortError" ? Ma : Fa);
        }) : e3.loadingState = a5 === null ? Fa : Pa;
      }
      let { children: s3 } = e3;
      if (r2.loadSiblings) {
        let t3 = false;
        for (let e4 = 0, n4 = s3.length; e4 < n4; e4++) {
          let n5 = s3[e4];
          n5 !== null && n5.target > 0 && (t3 = true);
        }
        if (t3 && e3.childCount < 4) for (let t4 = 0; t4 <= 1; t4++) for (let n4 = 0; n4 <= 1; n4++) r2._ensureTile(2 * e3.x + n4, 2 * e3.y + t4, e3.level + 1);
        for (let e4 = 0, n4 = s3.length; e4 < n4; e4++) {
          let n5 = s3[e4];
          n5 !== null && (n5.siblingForced = t3);
        }
      } else for (let e4 = 0, t3 = s3.length; e4 < t3; e4++) {
        let t4 = s3[e4];
        t4 !== null && (t4.siblingForced = false);
      }
      for (let e4 = 0, t3 = s3.length; e4 < t3; e4++) {
        let t4 = s3[e4];
        t4 !== null && i3(t4);
      }
    }
    function a3(e3, t3 = false, n3 = true) {
      let i4 = e3.target > 0 || e3.siblingForced, o3 = e3.visible && t3;
      e3.forced = t3;
      let s3 = (i4 ? e3.showTimer === Ia : e3.showTimer > 0) || o3, c3 = false;
      (i4 || o3) && (e3.loadingState === Pa && (n3 || o3) ? (c3 = true, t3 = false) : s3 && (t3 = true));
      let { children: l3 } = e3, u4 = true;
      if (r2.loadSiblings) for (let e4 = 0, t4 = l3.length; e4 < t4; e4++) {
        let t5 = l3[e4];
        (t5 === null || t5.loadingState !== Pa && t5.loadingState !== Fa) && (u4 = false);
      }
      let d5 = e3.visible || i4 || e3.showTimer > 0 || e3.prefetch > 0, f4 = false;
      for (let e4 = 0, n4 = l3.length; e4 < n4; e4++) {
        let n5 = l3[e4];
        if (n5 !== null) {
          d5 = a3(n5, t3, u4) || d5;
          let e5 = n5.target > 0 || n5.siblingForced, i5 = r2.loadSiblings && n5.loadingState === Fa;
          f4 || (f4 = e5 && !n5.visible && !i5);
        }
      }
      if (f4 && e3.loadingState === Pa && (c3 = true), r2.loadSiblings && c3 && e3.childCount === 4) {
        let e4 = true, t4 = false;
        for (let n4 = 0, r3 = l3.length; n4 < r3; n4++) {
          let r4 = l3[n4];
          !r4.visible && r4.loadingState !== Fa && (e4 = false), t4 || (t4 = r4.visible);
        }
        e4 && t4 && (c3 = false);
      }
      return c3 !== e3.visible && (e3.visible = c3, r2.dispatchEvent({
        type: "toggle",
        visible: c3,
        x: e3.x,
        y: e3.y,
        level: e3.level
      })), e3 !== r2.root && !d5 && Ba.add(e3), d5;
    }
  }
  getVisibleTiles() {
    let e2 = [];
    for (let t2 in this.cache) {
      let n2 = this.cache[t2];
      n2.visible && e2.push(n2);
    }
    return e2;
  }
  setTargetState(e2, t2, n2, r2) {
    if (r2) {
      let r3 = this._ensureTile(e2, t2, n2);
      r3.target++;
    } else {
      let r3 = this.cache[Ra(e2, t2, n2)];
      if (!r3 || r3.target <= 0) throw Error("MVTHierarchy: target ref count went negative \u2014 mismatched calls.");
      r3.target--;
    }
  }
  setPrefetchState(e2, t2, n2, r2) {
    if (r2) {
      let r3 = this._ensureTile(e2, t2, n2);
      r3.prefetch++;
    } else {
      let r3 = this.cache[Ra(e2, t2, n2)];
      if (!r3 || r3.prefetch <= 0) throw Error("MVTHierarchy: prefetch ref count went negative \u2014 mismatched calls.");
      r3.prefetch--;
    }
  }
  _deleteTile(e2) {
    if (e2 === this.root) throw Error();
    let { cache: t2 } = this, { x: n2, y: r2, level: i3 } = e2, a3 = Ra(n2, r2, i3);
    if (!(a3 in t2)) throw Error();
    t2[a3].remove(), delete t2[a3];
  }
  _ensureTile(e2, t2, n2) {
    let { cache: r2 } = this, i3 = Ra(e2, t2, n2);
    if (i3 in r2) return r2[i3];
    let a3 = new za();
    a3.x = e2, a3.y = t2, a3.level = n2;
    let o3 = e2 >> 1, s3 = t2 >> 1, c3 = n2 - 1;
    return this._ensureTile(o3, s3, c3).addChild(a3), r2[a3.getKey()] = a3, a3;
  }
};
var Ha = {
  test: () => false,
  mark: () => false
};
var Ua = 5e3;
function Wa(e2, t2) {
  return e2.sortValue === t2.sortValue ? e2.lodLevel === t2.lodLevel ? e2.visibleTime !== t2.visibleTime && (e2.visibleDuration < Ua || t2.visibleDuration < Ua) ? e2.visibleTime < t2.visibleTime ? -1 : 1 : t2.screenPos.y === e2.screenPos.y ? e2.id > t2.id ? 1 : -1 : t2.screenPos.y - e2.screenPos.y : t2.lodLevel - e2.lodLevel : e2.sortValue - t2.sortValue;
}
var Ga = class {
  constructor() {
    this.id = "", this.layer = "", this.properties = null, this.lodLevel = 0, this.enabled = true, this.valid = true, this.ready = false, this.horizonCutoff = 0.1, this.screenPos = new L4(), this.sortValue = 0, this.visibleDuration = Infinity, this.visibleTime = Infinity, this.visible = false;
  }
  updateTransform(e2, t2, n2) {
  }
  evaluate(e2, t2) {
    return false;
  }
  onShown() {
  }
  onHidden() {
  }
};
var Ka = class extends k4 {
  get hasPendingWork() {
    return this.working || this.needsUpdate;
  }
  constructor() {
    super(), this.camera = null, this.matrix = new P4(), this.useEllipsoidSurface = true, this.maxUpdateTimeMs = 0.5, this._task = null, this._deadline = 0, this.working = false, this.resolution = new I4(1, 1), this.size = 12, this.cells = new Uint32Array(1), this._totalResolution = new I4(), this._lastMatrix = new P4(), this._ndcMatrix = new P4(), this._invMatrix = new P4(), this._cameraLocalPos = new L4(), this.buffer = 0.15, this.items = [], this.visible = /* @__PURE__ */ new Set(), this.prevVisible = /* @__PURE__ */ new Set(), this.added = /* @__PURE__ */ new Set(), this._itemSet = /* @__PURE__ */ new Set(), this._itemsNeedsUpdate = false, this.needsUpdate = false, this._id = -1, this.handle = {
      test: (e2, t2, n2) => {
        let { cells: r2, _id: i3 } = this, a3 = false;
        return this._cellRange(e2, t2, n2, (e3, t3, n3) => (a3 = true, r2[n3] !== 0 && r2[n3] !== i3)) || !a3;
      },
      mark: (e2, t2, n2) => {
        let { cells: r2, _id: i3 } = this;
        return this._cellRange(e2, t2, n2, (e3, t3, n3) => (r2[n3] = i3, false));
      }
    }, this.sortValueCallback = () => 0;
  }
  _cellRange(e2, t2, n2, r2) {
    let { size: i3, resolution: a3, buffer: o3 } = this, s3 = a3.width, c3 = a3.height, l3 = s3 * o3, u4 = c3 * o3, { width: d5, height: f4 } = this._totalResolution, p4 = e2 + l3, m4 = t2 + u4, h5 = Math.max(0, Math.floor((p4 - n2) / i3)), g5 = Math.max(0, Math.floor((m4 - n2) / i3)), _6 = Math.min(d5 - 1, Math.floor((p4 + n2) / i3)), v6 = Math.min(f4 - 1, Math.floor((m4 + n2) / i3)), y6 = n2 * n2;
    for (let e3 = g5; e3 <= v6; e3++) for (let t3 = h5; t3 <= _6; t3++) {
      let n3 = Math.max(t3 * i3, Math.min(p4, (t3 + 1) * i3)), a4 = Math.max(e3 * i3, Math.min(m4, (e3 + 1) * i3)), o4 = p4 - n3, s4 = m4 - a4;
      if (o4 * o4 + s4 * s4 <= y6 && r2(t3, e3, e3 * d5 + t3) === true) return true;
    }
    return false;
  }
  syncItems() {
    let { items: e2, _itemSet: t2 } = this;
    if (this._itemsNeedsUpdate) {
      this._itemsNeedsUpdate = false, e2.length = t2.size;
      let n2 = 0;
      for (let r2 of t2.values()) e2[n2] = r2, n2++;
    }
  }
  _deadlineExpired() {
    return performance.now() >= this._deadline;
  }
  setDeadline(e2 = this.maxUpdateTimeMs) {
    this._deadline = performance.now() + e2;
  }
  update(e2 = this.maxUpdateTimeMs) {
    this.setDeadline(e2), this._task === null && (this._task = this._updateGenerator()), this._task.next();
  }
  flush() {
    this.setDeadline(Infinity), this._task === null && (this._task = this._updateGenerator());
    do
      this._task.next();
    while (this.working);
  }
  updateCameraTransform() {
    let { camera: e2, matrix: t2, _ndcMatrix: n2, _invMatrix: r2, _cameraLocalPos: i3 } = this;
    n2.copy(t2).premultiply(e2.matrixWorldInverse).premultiply(e2.projectionMatrix), r2.copy(t2).invert(), i3.setFromMatrixPosition(e2.matrixWorld).applyMatrix4(r2);
  }
  *_updateGenerator() {
    for (; ; ) {
      let { resolution: e2, size: t2, added: n2, handle: r2, sortValueCallback: i3, buffer: a3, items: o3, _lastMatrix: s3, _itemSet: c3, _ndcMatrix: l3, _cameraLocalPos: u4 } = this;
      if (this.updateCameraTransform(), s3.equals(l3) && !this.needsUpdate) {
        yield;
        continue;
      }
      s3.copy(l3), this.needsUpdate = false, this.working = true, this.syncItems(), [this.visible, this.prevVisible] = [this.prevVisible, this.visible];
      let { visible: d5, prevVisible: f4 } = this;
      d5.clear(), n2.clear(), this._totalResolution.copy(e2).multiplyScalar(1 + 2 * a3).multiplyScalar(1 / t2).ceil();
      let { width: p4, height: m4 } = this._totalResolution;
      this.cells.length === p4 * m4 ? this.cells.fill(0) : this.cells = new Uint8Array(p4 * m4);
      for (let t3 = 0, n3 = o3.length; t3 < n3; t3++) {
        let n4 = o3[t3];
        n4.enabled && (n4.updateTransform(l3, e2, u4, this.useEllipsoidSurface), n4.sortValue = i3(n4)), this._deadlineExpired() && (yield, this.updateCameraTransform());
      }
      o3.sort(Wa), this._deadlineExpired() && (yield, this.updateCameraTransform());
      for (let e3 = 0, t3 = o3.length; e3 < t3; e3++) {
        let t4 = o3[e3];
        this._id = e3 + 1, t4.enabled && c3.has(t4) && t4.evaluate(r2) && (d5.add(t4), f4.has(t4) ? (t4.visible = false, f4.delete(t4)) : (t4.visible = true, n2.add(t4))), this._deadlineExpired() && (yield, this.updateCameraTransform());
      }
      this.working = false, (n2.size > 0 || f4.size > 0) && this.dispatchEvent({
        type: "change",
        added: n2,
        removed: f4
      }), yield;
    }
  }
  refreshLayout(e2) {
    let { resolution: t2, _ndcMatrix: n2, _cameraLocalPos: r2, useEllipsoidSurface: i3 } = this;
    e2.updateTransform(n2, t2, r2, i3), e2.evaluate(Ha, true);
  }
  register(e2) {
    this._itemSet.add(e2), this._itemsNeedsUpdate = true, this.needsUpdate = true;
  }
  unregister(e2) {
    this._itemSet.delete(e2), this._itemsNeedsUpdate = true, this.needsUpdate = true;
  }
};
var qa = class extends k4 {
  get camera() {
    return this.manager.camera;
  }
  set camera(e2) {
    this.manager.camera = e2;
  }
  get matrix() {
    return this.manager.matrix;
  }
  get useEllipsoidSurface() {
    return this.manager.useEllipsoidSurface;
  }
  set useEllipsoidSurface(e2) {
    this.manager.useEllipsoidSurface = e2;
  }
  get resolution() {
    return this.manager.resolution;
  }
  get size() {
    return this.manager.size;
  }
  set size(e2) {
    this.manager.size = e2;
  }
  get cells() {
    return this.manager.cells;
  }
  get working() {
    return this.manager.working;
  }
  get hasPendingWork() {
    return this._showTimers.size > 0 || this._hideTimers.size > 0 || this.manager.hasPendingWork;
  }
  get sortValueCallback() {
    return this.manager.sortValueCallback;
  }
  set sortValueCallback(e2) {
    this.manager.sortValueCallback = e2;
  }
  get maxUpdateTimeMs() {
    return this.manager.maxUpdateTimeMs;
  }
  set maxUpdateTimeMs(e2) {
    this.manager.maxUpdateTimeMs = e2;
  }
  get buffer() {
    return this.manager.buffer;
  }
  set buffer(e2) {
    this.manager.buffer = e2;
  }
  get needsUpdate() {
    return this.manager.needsUpdate;
  }
  set needsUpdate(e2) {
    this.manager.needsUpdate = e2;
  }
  constructor() {
    super(), this.manager = new Ka(), this.visible = /* @__PURE__ */ new Set(), this.showDelay = 0.5, this.hideDelay = 0.5, this._showTimers = /* @__PURE__ */ new Map(), this._hideTimers = /* @__PURE__ */ new Map(), this._lastUpdateTime = -1, this.added = /* @__PURE__ */ new Set(), this.removed = /* @__PURE__ */ new Set(), this.manager.addEventListener("change", ({ added: e2, removed: t2 }) => {
      let { _showTimers: n2, _hideTimers: r2, visible: i3 } = this;
      for (let t3 of e2) r2.delete(t3), i3.has(t3) || (t3.onShown(), n2.set(t3, 0));
      for (let e3 of t2) n2.delete(e3) ? e3.onHidden() : i3.has(e3) && r2.set(e3, 0);
    });
  }
  register(e2) {
    return this.manager.register(e2);
  }
  unregister(e2) {
    this.manager.unregister(e2);
  }
  syncItems() {
    this.manager.syncItems();
  }
  flush() {
    this.manager.flush();
  }
  update(...e2) {
    let t2 = performance.now() / 1e3, n2 = this._lastUpdateTime < 0 ? 0 : Math.min(t2 - this._lastUpdateTime, 0.1);
    this._lastUpdateTime = t2, this.manager.update(...e2);
    let { _showTimers: r2, _hideTimers: i3, visible: a3, added: o3, removed: s3, showDelay: c3, hideDelay: l3 } = this, u4 = performance.now();
    for (let [e3, t3] of r2) {
      let i4 = t3 + n2;
      i4 >= c3 ? (r2.delete(e3), a3.add(e3), o3.add(e3), s3.delete(e3), e3.visibleTime = u4) : r2.set(e3, i4);
    }
    for (let [e3, t3] of i3) {
      let r3 = t3 + n2;
      r3 >= l3 || !e3.valid ? (i3.delete(e3), a3.delete(e3), s3.add(e3), o3.delete(e3), e3.onHidden()) : i3.set(e3, r3);
    }
    for (let e3 of a3.values()) e3.visibleDuration = u4 - e3.visibleTime, this.manager.refreshLayout(e3), e3.valid === false && !i3.has(e3) && (i3.set(e3, 0), this.manager.needsUpdate = true);
    (o3.size > 0 || s3.size > 0) && this.dispatchEvent({
      type: "change",
      added: o3,
      removed: s3
    });
  }
  finishAnimations() {
    let { _showTimers: e2, _hideTimers: t2, visible: n2, added: r2, removed: i3 } = this, a3 = performance.now();
    for (let t3 of e2.keys()) n2.add(t3), r2.add(t3), i3.delete(t3), t3.visibleTime = a3;
    e2.clear();
    for (let e3 of t2.keys()) n2.delete(e3), i3.add(e3), r2.delete(e3), e3.onHidden();
    t2.clear();
  }
  reset() {
    this.added.clear(), this.removed.clear();
  }
};
var Ja = 5e5;
var Ya = /* @__PURE__ */ new L4();
var Xa = /* @__PURE__ */ new L4();
var Za = [];
var Qa = [0, 0];
var $a = 0;
var eo = class extends Ga {
  get count() {
    return this.lat.length;
  }
  get anchorCount() {
    return this.anchorPositions.length;
  }
  constructor() {
    super(), this.text = "", this.characterWidths = [], this.characterRadius = 0, this.totalTextWidth = 0, this.range = null, this.lat = [], this.lon = [], this.positions = [], this.anchorPositions = [], this.screenPositions = [], this.cumulativeLen = [], this.facingRatios = [], this.cachedMatrix = new P4(), this.cachedResolution = new I4(), this.needsUpdate = false;
  }
  evaluate() {
    throw Error();
  }
  updateTransform(e2, t2, n2, r2 = true) {
    let { positions: i3, screenPositions: a3, cachedMatrix: o3, cachedResolution: s3, cumulativeLen: c3 } = this;
    if (!this.needsUpdate && o3.equals(e2) && s3.equals(t2)) return;
    for (this.needsUpdate = false, o3.copy(e2), s3.copy(t2); a3.length < i3.length; ) a3.push(new L4());
    let { facingRatios: l3 } = this;
    l3.length = a3.length;
    for (let o4 = 0, s4 = a3.length; o4 < s4; o4++) {
      let s5 = i3[o4], c4 = a3[o4];
      c4.copy(s5).applyMatrix4(e2), c4.x = (c4.x * 0.5 + 0.5) * t2.width, c4.y = (-c4.y * 0.5 + 0.5) * t2.height, c4.z = N4.mapLinear(c4.z, -1, 1, 0, 1), n2 !== null && (!r2 || s5.lengthSq() > 0) ? (Ya.subVectors(n2, s5).normalize(), r2 ? Xa.copy(s5).normalize() : Xa.set(0, 0, 1), l3[o4] = Xa.dot(Ya)) : l3[o4] = 1;
    }
    c3.length = a3.length, c3[0] = 0;
    for (let e3 = 1; e3 < a3.length; e3++) {
      let t3 = a3[e3 - 1], n3 = a3[e3], r3 = n3.x - t3.x, i4 = n3.y - t3.y, o4 = Math.sqrt(r3 * r3 + i4 * i4);
      c3[e3] = c3[e3 - 1] + o4;
    }
  }
  updateCharacterWidthCache(e2) {
    let { text: t2, characterWidths: n2, properties: r2, layer: i3 } = this;
    n2.length = t2.length;
    let a3 = 0;
    for (let o3 = 0, s3 = t2.length; o3 < s3; o3++) {
      let s4 = e2(t2[o3], i3, r2);
      n2[o3] = s4, a3 += s4;
    }
    this.totalTextWidth = a3, this.characterRadius = e2("M", i3, r2);
  }
  hasCoverage(e2, t2) {
    let [n2, r2, i3, a3] = this.range;
    return t2 >= n2 && t2 <= i3 && e2 >= r2 && e2 <= a3;
  }
  generateAnchors(e2) {
    let { lat: t2, lon: n2 } = this, r2 = [], i3 = 0;
    for (let e3 = 0, a4 = t2.length - 1; e3 < a4; e3++) {
      let a5 = t2[e3], o4 = t2[e3 + 1], s4 = n2[e3], c4 = n2[e3 + 1], l3 = 0.5 * (a5 + o4), u4 = o4 - a5, d5 = (c4 - s4) * Math.cos(l3), f4 = Math.sqrt(u4 * u4 + d5 * d5);
      r2.push(f4), i3 += f4;
    }
    let a3 = e2 * 0.5;
    a3 > i3 && (a3 = i3 * 0.5);
    let o3 = 0, s3 = 0, c3 = [];
    for (; a3 <= i3; ) {
      for (; s3 < r2.length && o3 + r2[s3] < a3; ) o3 += r2[s3], s3++;
      if (s3 >= r2.length) break;
      let i4 = s3, l3 = s3 + 1, u4 = r2[i4], d5 = u4 > 0 ? (a3 - o3) / u4 : 0;
      c3.push({
        i0: i4,
        i1: l3,
        alpha: d5,
        ref: null,
        lat: N4.lerp(t2[i4], t2[l3], d5),
        lon: N4.lerp(n2[i4], n2[l3], d5)
      }), a3 += e2;
    }
    this.anchorPositions = c3;
  }
};
function to(e2, t2, n2) {
  n2.length = 0;
  for (let r3 = 0, i3 = e2.length - 1; r3 < i3; r3++) {
    let i4 = e2[r3], a3 = e2[r3 + 1];
    n2.push(i4.x, i4.y);
    let o3 = a3.x - i4.x, s3 = a3.y - i4.y, c3 = Math.sqrt(o3 * o3 + s3 * s3), l3 = Math.ceil(c3 / t2);
    for (let e3 = 1; e3 < l3; e3++) {
      let t3 = e3 / l3;
      n2.push(N4.lerp(i4.x, a3.x, t3), N4.lerp(i4.y, a3.y, t3));
    }
  }
  let r2 = e2[e2.length - 1];
  return n2.push(r2.x, r2.y), n2;
}
function no(e2, t2, n2, r2, i3, a3, o3, s3 = []) {
  let c3 = Ja / o3.radius.x, [l3, u4, d5, f4] = r2, { flipY: p4, projection: m4 } = a3, h5 = e2.extent, g5 = h5 * 0.015625, _6 = `${t2}:${e2.properties.name || e2.id || `unnamed_${$a++}`}`, v6 = e2.loadGeometry();
  for (let r3 of v6) {
    let a4 = to(r3, g5, Za), o4 = new eo();
    o4.id = _6, o4.layer = t2, o4.properties = e2.properties, o4.lodLevel = n2, o4.range = i3;
    for (let e3 = 0, t3 = a4.length; e3 < t3; e3 += 2) {
      let t4 = N4.lerp(l3, d5, a4[e3] / h5), n3 = a4[e3 + 1] / h5, r4 = p4 ? N4.lerp(f4, u4, n3) : N4.lerp(u4, f4, n3), [i4, s4] = m4.fromNormalizedToCartographic(t4, r4, Qa);
      o4.lon.push(i4), o4.lat.push(s4), o4.positions.push(new L4());
    }
    o4.generateAnchors(c3 * (i3[2] - i3[0])), s3.push(o4);
  }
  return s3;
}
var ro = 1e-10;
var io = 16e-4;
var ao = /* @__PURE__ */ new xe2();
var oo = /* @__PURE__ */ new L4();
var so = [];
var co = /* @__PURE__ */ new L4();
var lo = /* @__PURE__ */ new L4();
function uo(e2, t2) {
  let { ray: n2 } = e2, { planes: r2 } = t2, i3 = 0, a3 = e2.far;
  for (let e3 = 0; e3 < 6; e3++) {
    let t3 = r2[e3], o3 = t3.normal.dot(n2.direction);
    if (Math.abs(o3) < ro) {
      if (t3.distanceToPoint(n2.origin) < 0) return false;
    } else {
      let e4 = n2.distanceToPlane(t3);
      if (o3 > 0) e4 !== null && e4 > i3 && (i3 = e4);
      else {
        if (e4 === null) return false;
        e4 < a3 && (a3 = e4);
      }
      if (i3 > a3) return false;
    }
  }
  return true;
}
var fo = class {
  get hasPendingWork() {
    return this._queue.size > 0;
  }
  constructor() {
    this.tiles = null, this.occupancy = null, this.camera = null, this.maxSettleTimeMs = 1, this.performSettleRaycast = null, this.elevationSource = null, this._queue = /* @__PURE__ */ new Set(), this._items = /* @__PURE__ */ new Set(), this.needsUpdate = false, this._task = null, this._deadline = 0;
  }
  register(e2) {
    this._items.add(e2), this._queue.add(e2);
  }
  unregister(e2) {
    this._items.delete(e2), this._queue.delete(e2);
  }
  update(e2 = this.maxSettleTimeMs) {
    if (this.setDeadline(e2), this.needsUpdate) {
      this.needsUpdate = false;
      for (let e3 of this._items.values()) this._queue.add(e3);
    }
    this._task === null && (this._task = this._settleGenerator()), this._task.next();
  }
  setDeadline(e2 = this.maxSettleTimeMs) {
    this._deadline = performance.now() + e2;
  }
  _deadlineExpired() {
    return performance.now() >= this._deadline;
  }
  _getSettleThreshold(e2) {
    let { surface: t2 } = this.tiles, n2 = e2 instanceof eo, r2 = n2 ? e2.lat[0] : e2.lat, i3 = n2 ? e2.lon[0] : e2.lon, a3 = 2 * Math.PI / 2 ** e2.lodLevel, o3 = i3 + a3 <= Math.PI ? i3 + a3 : i3 - a3;
    return t2.getCartographicToPosition(r2, i3, 0, co), t2.getCartographicToPosition(r2, o3, 0, lo), io * co.distanceTo(lo);
  }
  _getSettlingRay(e2, t2, n2) {
    let { tiles: r2 } = this, { origin: i3, direction: a3 } = n2.ray;
    r2.surface.getCartographicToPosition(e2, t2, 1e8, i3), r2.surface.getCartographicToPosition(e2, t2, 0, a3), a3.sub(i3).normalize(), n2.far = 2 * 1e8, n2.firstHitOnly = true;
  }
  _settleSample(e2, t2, n2, r2) {
    let { tiles: i3, performSettleRaycast: a3, elevationSource: o3 } = this;
    if (a3 === null && o3 !== null) {
      let a4 = o3.sampleCartographicElevation(e2, t2);
      i3.surface.getCartographicToPosition(e2, t2, a4 === null ? 0 : a4, oo), oo.distanceTo(n2) > r2 && n2.copy(oo);
      return;
    }
    let { origin: s3, direction: c3 } = ao.ray;
    this._getSettlingRay(e2, t2, ao), s3.applyMatrix4(i3.group.matrixWorld), c3.transformDirection(i3.group.matrixWorld);
    let l3 = false;
    a3 === null ? (so.length = 0, ao.intersectObject(i3.group, true, so), so.length > 0 && (oo.copy(so[0].point), l3 = true)) : l3 = a3(ao.ray, e2, t2, oo), l3 ? oo.applyMatrix4(i3.group.matrixWorldInverse) : i3.surface.getCartographicToPosition(e2, t2, 0, oo), oo.distanceTo(n2) > r2 && n2.copy(oo);
  }
  *_settleGenerator() {
    let e2 = new P4(), t2 = new M5(), n2 = /* @__PURE__ */ new Set(), r2 = [
      [],
      [],
      [],
      []
    ];
    for (; ; ) {
      let { _queue: i3, _items: a3, tiles: o3, camera: s3, occupancy: c3 } = this;
      if (s3 !== null) {
        e2.copy(o3.group.matrixWorld).premultiply(s3.matrixWorldInverse).premultiply(s3.projectionMatrix), t2.setFromProjectionMatrix(e2);
        for (let e3 of i3) if (!c3.visible.has(e3)) {
          if (e3 instanceof eo) {
            let { anchorPositions: r3 } = e3, { lat: i4, lon: a4 } = r3[r3.length >> 1];
            if (this._getSettlingRay(i4, a4, ao), uo(ao, t2)) {
              n2.add(e3);
              continue;
            }
          } else this._getSettlingRay(e3.lat, e3.lon, ao), uo(ao, t2) && n2.add(e3);
          this._deadlineExpired() && (yield);
        }
      }
      for (let e3 of i3) {
        let t3 = n2.has(e3), i4 = 0;
        !e3.ready && t3 ? i4 = 3 : c3.visible.has(e3) ? i4 = 2 : t3 && (i4 = 1), r2[i4].push(e3), this._deadlineExpired() && (yield);
      }
      for (let e3 = r2.length - 1; e3 >= 0; e3--) {
        let t3 = r2[e3];
        for (; t3.length > 0; ) {
          let e4 = t3.pop();
          if (i3.delete(e4), a3.has(e4)) {
            if (!e4.enabled) {
              e4.ready = false;
              continue;
            }
            yield* this._settleItem(e4), this._deadlineExpired() && (yield);
          }
        }
      }
      n2.clear(), r2.forEach((e3) => e3.length = 0), yield;
    }
  }
  *_settleItem(e2) {
    let t2 = this._getSettleThreshold(e2);
    if (e2 instanceof eo) {
      let { _items: n2 } = this, { lat: r2, lon: i3, positions: a3 } = e2;
      for (let o3 = 0, s3 = r2.length; o3 < s3; o3++) if (this._settleSample(r2[o3], i3[o3], a3[o3], t2), this._deadlineExpired() && (yield, !n2.has(e2))) return;
      e2.needsUpdate = true;
    } else this._settleSample(e2.lat, e2.lon, e2.position, t2);
    e2.ready = true;
  }
};
var po = Math.PI / 4;
var mo = 3 / 5;
var ho = 0.8;
var X4 = {
  NONE: 0,
  NOT_READY: 1,
  NO_FIT: 2,
  DEPTH: 3,
  OCCUPANCY: 4,
  SPACING: 5,
  ANGLE: 6,
  FACING: 7
};
var go = [];
var _o = [];
var vo = /* @__PURE__ */ new L4();
var yo = /* @__PURE__ */ new I4();
var bo = /* @__PURE__ */ new I4();
var xo = /* @__PURE__ */ new I4();
var So = [];
var Co = [];
var wo = 0;
var To = class extends Ga {
  get lat() {
    return this.getActiveReference().lat;
  }
  get lon() {
    return this.getActiveReference().lon;
  }
  get ready() {
    return this.getActiveReference().line.ready;
  }
  set ready(e2) {
  }
  get properties() {
    return this.getActiveReference().line.properties;
  }
  set properties(e2) {
  }
  get enabled() {
    return this.getActiveReference().line.enabled;
  }
  set enabled(e2) {
  }
  get text() {
    return this.getActiveReference().line.text;
  }
  constructor(e2) {
    super(), this.id = `${e2}_${wo++}`, this.displayed = false, this.referencePaths = [], this._activeReference = null, this._snapped = null, this._flippedTextDir = false, this.characterPositions = [], this.characterAngles = [], this.rejectionReason = X4.NONE;
  }
  evaluate(e2, t2 = false) {
    this.rejectionReason = X4.NONE;
    let { text: n2 } = this;
    if (!n2) return false;
    let { line: r2 } = this.getActiveReference(), { cumulativeLen: i3 } = r2;
    return !r2.ready || i3.length < 2 ? (this.rejectionReason = X4.NOT_READY, false) : (this._flippedTextDir = this._getTextDirection(), go.length = n2.length, _o.length = n2.length, this._layoutCharacters(e2, go, _o, t2), !this.valid && !t2 ? false : (this._placeCharacters(e2, go, _o), true));
  }
  _reject(e2) {
    this.valid && (this.rejectionReason = e2), this.valid = false;
  }
  _getTextDirection() {
    let { line: e2, i0: t2, i1: n2, alpha: r2 } = this.getActiveReference(), { cumulativeLen: i3, screenPositions: a3, totalTextWidth: o3 } = e2, s3 = N4.lerp(i3[t2], i3[n2], r2), c3 = o3 * 0.5, l3 = s3 - c3, u4 = s3 + c3, d5 = 0, f4 = 0, p4 = i3.length - 2, m4 = 1;
    for (let e3 = 0, t3 = i3.length - 2; e3 < t3; e3++) {
      let t4 = e3 + 1, n3 = i3[e3], r3 = i3[t4];
      l3 >= n3 && l3 <= r3 && (d5 = e3, f4 = N4.mapLinear(l3, n3, r3, 0, 1)), u4 >= n3 && u4 <= r3 && (p4 = e3, m4 = N4.mapLinear(u4, n3, r3, 0, 1));
    }
    let h5 = vo.lerpVectors(a3[d5], a3[d5 + 1], f4).x;
    return vo.lerpVectors(a3[p4], a3[p4 + 1], m4).x < h5;
  }
  _layoutCharacters(e2, t2, n2, r2 = false) {
    let { line: i3, i0: a3, i1: o3, alpha: s3 } = this.getActiveReference(), { cumulativeLen: c3, screenPositions: l3, facingRatios: u4, totalTextWidth: d5, characterWidths: f4, characterRadius: p4, text: m4 } = i3, h5 = N4.lerp(c3[a3], c3[o3], s3), g5 = this._flippedTextDir;
    this.valid = true;
    let _6 = l3.length, v6 = c3[c3.length - 1], y6 = m4.length, b6 = h5 - d5 * 0.5, x6 = mo * p4, S5 = 0, C5 = 0;
    So.length = 0, Co.length = 0;
    let w5 = 0, T6 = 0, E5 = 0;
    for (let a4 = 0; a4 < y6; a4++) {
      let o4 = g5 ? y6 - 1 - a4 : a4, s4 = f4[o4], m5 = T6 + s4 * 0.5 - d5 * 0.5;
      T6 += s4;
      let D6 = h5 + m5;
      if ((D6 < 0 || D6 > v6) && (this._reject(X4.NO_FIT), !r2)) break;
      for (; w5 < _6 - 2 && c3[w5 + 1] < D6; ) {
        w5++;
        let e3 = c3[w5];
        if (e3 < b6) continue;
        let t3 = l3[w5 - 1], n3 = l3[w5], i4 = l3[w5 + 1];
        bo.set(n3.x - t3.x, n3.y - t3.y), xo.set(i4.x - n3.x, i4.y - n3.y);
        let a5 = Math.abs(Math.atan2(bo.cross(xo), bo.dot(xo)));
        for (So.push(e3), Co.push(a5), S5 += a5; e3 - So[C5] > x6; ) S5 -= Co[C5], C5++;
        if (S5 > po && (this._reject(X4.ANGLE), !r2)) break;
      }
      if (!this.valid && !r2) break;
      let O5 = w5 + 1, k5 = c3[O5] - c3[w5], A6 = k5 > 0 ? (D6 - c3[w5]) / k5 : 0, j5 = l3[w5], M6 = l3[O5];
      if (vo.lerpVectors(j5, M6, A6), vo.z < 0 || vo.z > 1) {
        if (this._reject(X4.DEPTH), !r2) break;
      } else if (N4.lerp(u4[w5], u4[O5], A6) < i3.horizonCutoff) {
        if (this._reject(X4.FACING), !r2) break;
      } else if (e2.test(vo.x, vo.y, p4) && (this._reject(X4.OCCUPANCY), !r2)) break;
      if (a4 > 0) {
        let e3 = vo.x - yo.x, t3 = vo.y - yo.y, n3 = e3 * e3 + t3 * t3, i4 = (s4 + E5) * 0.5 * ho;
        if (n3 < i4 * i4 && (this._reject(X4.SPACING), !r2)) break;
      }
      E5 = s4, yo.copy(vo), t2[o4] = w5, n2[o4] = A6;
    }
  }
  _placeCharacters(e2, t2, n2) {
    let { characterPositions: r2, characterAngles: i3, text: a3 } = this, { line: o3 } = this.getActiveReference(), { screenPositions: s3, positions: c3, characterRadius: l3 } = o3, u4 = this._flippedTextDir, d5 = a3.length;
    for (; r2.length < d5; ) r2.push(new L4());
    r2.length = d5, i3.length = d5;
    for (let a4 = 0; a4 < d5; a4++) {
      let o4 = t2[a4], d6 = n2[a4], f4 = s3[o4], p4 = s3[o4 + 1];
      e2.mark(f4.x + (p4.x - f4.x) * d6, f4.y + (p4.y - f4.y) * d6, l3), r2[a4].lerpVectors(c3[o4], c3[o4 + 1], d6);
      let m4 = (p4.x - f4.x) * (u4 ? -1 : 1), h5 = (p4.y - f4.y) * (u4 ? -1 : 1);
      i3[a4] = Math.atan2(h5, m4);
    }
  }
  updateTransform(e2, t2, n2, r2 = true) {
    this.updateActiveReference(), this.getActiveReference().line.updateTransform(e2, t2, n2, r2);
  }
  isEmpty() {
    return this.referencePaths.length === 0;
  }
  hasLoD(e2) {
    return this.referencePaths.find((t2) => t2.line.lodLevel === e2);
  }
  getPosition(e2) {
    let { line: t2, i0: n2, i1: r2, alpha: i3 } = this.getActiveReference();
    return e2.lerpVectors(t2.positions[n2], t2.positions[r2], i3);
  }
  getActiveReference() {
    return this._snapped ?? this._activeReference;
  }
  updateActiveReference() {
    let { referencePaths: e2, _activeReference: t2, displayed: n2 } = this, r2, i3 = e2[0] ?? null;
    if (r2 = i3 && i3.line.ready ? i3 : t2 && t2.line.ready && (e2.includes(t2) || this.displayed) ? t2 : i3 ?? t2, r2 && t2 && r2 !== t2) if (n2) {
      let { lat: e3, lon: n3 } = this._snapped ?? t2;
      this._snapped = this._snapToLine(r2.line, e3, n3);
    } else this._snapped = null;
    return this._activeReference = r2, r2;
  }
  _snapToLine(e2, t2, n2) {
    let { lat: r2, lon: i3 } = e2;
    if (r2.length < 2) return null;
    let a3 = Infinity, o3 = 0, s3 = 1, c3 = 0, l3 = r2[0], u4 = i3[0];
    for (let e3 = 0, d5 = r2.length - 1; e3 < d5; e3++) {
      let d6 = r2[e3], f4 = i3[e3], p4 = r2[e3 + 1] - d6, m4 = i3[e3 + 1] - f4, h5 = p4 * p4 + m4 * m4, g5 = h5 > 0 ? N4.clamp(((t2 - d6) * p4 + (n2 - f4) * m4) / h5, 0, 1) : 0, _6 = d6 + p4 * g5, v6 = f4 + m4 * g5, y6 = t2 - _6, b6 = n2 - v6, x6 = y6 * y6 + b6 * b6;
      x6 < a3 && (a3 = x6, o3 = e3, s3 = e3 + 1, c3 = g5, l3 = _6, u4 = v6);
    }
    return {
      line: e2,
      i0: o3,
      i1: s3,
      alpha: c3,
      lat: l3,
      lon: u4
    };
  }
  onShown() {
    this.displayed = true, this._snapped = null;
  }
  onHidden() {
    this.displayed = false;
  }
  addLine(e2, t2) {
    let n2 = e2.anchorPositions[t2], { referencePaths: r2 } = this;
    r2.push({
      line: e2,
      i0: n2.i0,
      i1: n2.i1,
      alpha: n2.alpha,
      lat: n2.lat,
      lon: n2.lon
    }), r2.sort((e3, t3) => t3.line.lodLevel - e3.line.lodLevel), this.updateActiveReference();
  }
  removeLine(e2) {
    let { referencePaths: t2 } = this, n2 = false;
    for (let r2 = 0; r2 < t2.length; r2++) t2[r2].line === e2 && (t2.splice(r2, 1), r2--, n2 = true);
    return n2;
  }
};
var Eo = class {
  constructor() {
    this.added = /* @__PURE__ */ new Set(), this.removed = /* @__PURE__ */ new Set(), this._anchorsById = /* @__PURE__ */ new Map(), this._linesById = /* @__PURE__ */ new Map(), this.lines = /* @__PURE__ */ new Set(), this.anchors = /* @__PURE__ */ new Set();
  }
  reset() {
    this.added.clear(), this.removed.clear();
  }
  update() {
    let { _anchorsById: e2, removed: t2 } = this;
    e2.forEach((n2, r2) => {
      n2.forEach((e3) => {
        e3.isEmpty() && (n2.delete(e3), this.anchors.delete(e3), t2.add(e3));
      }), n2.size === 0 && e2.delete(r2);
    });
  }
  addLines(e2) {
    let { _anchorsById: t2, _linesById: n2, added: r2 } = this, i3 = /* @__PURE__ */ new Map();
    e2.forEach((e3) => {
      i3.has(e3.id) || i3.set(e3.id, []), i3.get(e3.id).push(e3);
    }), i3.forEach((e3, i4) => {
      t2.has(i4) || t2.set(i4, /* @__PURE__ */ new Set()), n2.has(i4) || n2.set(i4, /* @__PURE__ */ new Set());
      let a3 = e3[0], o3 = t2.get(i4);
      o3.forEach((t3) => {
        let n3 = Infinity, r3 = null, i5 = -1;
        !a3.hasCoverage(t3.lat, t3.lon) || t3.hasLoD(a3.lodLevel) || (e3.forEach((e4) => {
          e4.anchorPositions.forEach((a4, o4) => {
            if (a4.ref === null) {
              let s3 = t3.lat - a4.lat, c3 = t3.lon - a4.lon, l3 = s3 * s3 + c3 * c3;
              l3 < n3 && (n3 = l3, r3 = e4, i5 = o4);
            }
          });
        }), r3 && (t3.addLine(r3, i5), r3.anchorPositions[i5].ref = t3));
      }), e3.forEach((e4) => {
        e4.anchorPositions.forEach((t3, n3) => {
          if (t3.ref === null) {
            let a4 = new To(i4);
            a4.addLine(e4, n3), e4.hasCoverage(a4.lat, a4.lon) && (t3.ref = a4, o3.add(a4), this.anchors.add(a4), r2.add(a4));
          }
        });
      });
    }), i3.forEach((e3, t3) => {
      let r3 = n2.get(t3);
      e3.forEach((e4) => {
        r3.add(e4), this.lines.add(e4);
      });
    });
  }
  deleteLines(e2) {
    let { _anchorsById: t2, _linesById: n2 } = this, r2 = /* @__PURE__ */ new Set();
    e2.forEach((e3) => {
      let i3 = e3.id;
      n2.get(i3).delete(e3), this.lines.delete(e3), n2.get(i3).size === 0 && n2.delete(i3);
      let a3 = t2.get(i3);
      a3 && a3.forEach((t3) => {
        t3.removeLine(e3) && r2.add(t3);
      });
    }), r2.forEach((e3) => e3.updateActiveReference());
  }
};
var Do = class {
  constructor(e2) {
    this.enabled = false, this.canvas = null, this.occupancyManager = e2;
  }
  update() {
    let { occupancyManager: e2, enabled: t2 } = this;
    if (!t2) {
      this.dispose();
      return;
    }
    if (this.canvas === null) {
      let e3 = document.createElement("canvas");
      e3.style.cssText = "position:fixed;top:0;left:0;pointer-events:none;opacity:0.5;", document.body.appendChild(e3), this.canvas = e3;
    }
    if (e2.working) return;
    let { canvas: n2 } = this, { cells: r2, size: i3, resolution: a3, buffer: o3 } = e2, s3 = window.devicePixelRatio, c3 = a3.width * o3, l3 = a3.height * o3, u4 = Math.ceil((a3.width + 2 * c3) / i3), d5 = Math.ceil((a3.height + 2 * l3) / i3);
    n2.width = Math.round(s3 * (a3.width + 2 * c3)), n2.height = Math.round(s3 * (a3.height + 2 * l3)), n2.style.width = `${a3.width + 2 * c3}px`, n2.style.height = `${a3.height + 2 * l3}px`, n2.style.left = `${-c3}px`, n2.style.top = `${-l3}px`;
    let f4 = i3 * s3, p4 = n2.getContext("2d");
    p4.clearRect(0, 0, n2.width, n2.height);
    for (let e3 = 0; e3 < d5; e3++) for (let t3 = 0; t3 < u4; t3++) {
      let n3 = r2[e3 * u4 + t3] !== 0;
      p4.fillStyle = n3 ? "rgba( 255, 80, 80, 0.6 )" : "rgba( 80, 255, 80, 0.15 )", p4.fillRect(t3 * f4 + 0.5, e3 * f4 + 0.5, f4 - 1, f4 - 1), p4.strokeStyle = n3 ? "rgba( 255, 80, 80, 1 )" : "rgba( 80, 255, 80, 0.25 )", p4.lineWidth = 1, p4.strokeRect(t3 * f4 + 0.5, e3 * f4 + 0.5, f4 - 1, f4 - 1);
    }
  }
  dispose() {
    this.canvas !== null && (this.canvas.remove(), this.canvas = null);
  }
};
var Oo = new class {
  constructor() {
    this._cache = {};
  }
  getColor(...e2) {
    let t2 = e2.pop(), n2 = e2.join("_"), { _cache: r2 } = this;
    return n2 in r2 || (t2.setHSL(Math.random(), 1, 0.5), r2[n2] = t2.getHex()), t2.set(r2[n2]);
  }
}();
var ko = {
  NONE: 0,
  ID: 1,
  LEVEL: 2,
  TILE: 3,
  NAME: 4,
  REJECTION: 5
};
var Ao = {
  [X4.NONE]: 16777215,
  [X4.NOT_READY]: 7829367,
  [X4.NO_FIT]: 2250239,
  [X4.DEPTH]: 4473924,
  [X4.OCCUPANCY]: 65535,
  [X4.SPACING]: 16776960,
  [X4.ANGLE]: 16711680,
  [X4.FACING]: 16711935
};
var jo = /* @__PURE__ */ new L4();
var Mo = /* @__PURE__ */ new L4();
var No = /* @__PURE__ */ new w4();
function Po() {
  let e2 = new E4(new Uint8Array(1024 * 4), 32, 32);
  for (let t2 = 0; t2 < 32; t2++) for (let n2 = 0; n2 < 32; n2++) {
    let r2 = (t2 - 16) / 16, i3 = (n2 - 16) / 16, a3 = Math.sqrt(r2 * r2 + i3 * i3), o3 = n2 * 32 + t2;
    e2.image.data[4 * o3 + 0] = 255, e2.image.data[4 * o3 + 1] = 255, e2.image.data[4 * o3 + 2] = 255, e2.image.data[4 * o3 + 3] = a3 < 1 ? 255 : 0;
  }
  return e2.needsUpdate = true, e2;
}
var Fo = class {
  get ColorMode() {
    return ko;
  }
  constructor(e2) {
    this.enabled = false, this.colorMode = ko.NONE, this.displayLines = true, this.displayAnchors = true, this.camera = null, this.anchorManager = e2, this.group = null, this._lines = null, this._points = null;
  }
  update() {
    let { enabled: e2, group: t2, camera: n2, anchorManager: r2, displayAnchors: i3, displayLines: a3 } = this;
    if (!e2) {
      this.dispose();
      return;
    }
    if (this._lines === null) {
      let e3 = new re3();
      e3.material.transparent = true, e3.material.depthTest = false, e3.material.depthWrite = false, e3.material.vertexColors = true, e3.frustumCulled = false, e3.raycast = () => {
      };
      let n3 = new me2();
      n3.material.transparent = true, n3.material.depthTest = false, n3.material.depthWrite = false, n3.material.map = Po(), n3.material.size = 6, n3.material.sizeAttenuation = false, n3.material.vertexColors = true, n3.frustumCulled = false, n3.raycast = () => {
      }, t2.add(e3, n3), this._lines = e3, this._points = n3;
    }
    let { _lines: o3, _points: s3 } = this;
    n2 === null ? jo.set(0, 0, 0) : (jo.setFromMatrixPosition(n2.matrixWorld), t2.worldToLocal(jo));
    let c3 = Array.from(r2.lines).filter((e3) => e3 instanceof eo && e3.ready), l3 = 0;
    for (let e3 of c3) l3 += e3.count - 1;
    let u4 = new x5(new Float32Array(l3 * 2 * 3), 3), d5 = new x5(new Float32Array(l3 * 2 * 3), 3), f4 = 0;
    for (let e3 of c3) {
      this._getColor(e3, No);
      let t3 = e3.positions;
      for (let e4 = 0, n3 = t3.length - 1; e4 < n3; e4++) u4.setXYZ(f4 + 0, ...Mo.copy(t3[e4]).sub(jo)), u4.setXYZ(f4 + 1, ...Mo.copy(t3[e4 + 1]).sub(jo)), d5.setXYZ(f4 + 0, ...No), d5.setXYZ(f4 + 1, ...No), f4 += 2;
    }
    let p4 = Array.from(r2.anchors).filter((e3) => e3.ready), m4 = new x5(new Float32Array(p4.length * 3), 3), h5 = new x5(new Float32Array(p4.length * 2 * 3), 3);
    f4 = 0;
    for (let e3 of p4) e3.getPosition(Mo).sub(jo), m4.setXYZ(f4, ...Mo), this.colorMode === ko.REJECTION ? No.set(Ao[e3.rejectionReason] ?? 16777215) : this._getColor(e3.getActiveReference().line, No), h5.setXYZ(f4, ...No), f4++;
    o3.geometry.dispose(), o3.geometry.setAttribute("position", u4), o3.geometry.setAttribute("color", d5), o3.position.copy(jo), o3.updateMatrixWorld(), o3.visible = a3, s3.geometry.dispose(), s3.geometry.setAttribute("position", m4), s3.geometry.setAttribute("color", h5), s3.position.copy(jo), s3.updateMatrixWorld(), s3.visible = i3;
  }
  dispose() {
    this._lines !== null && (this._lines.removeFromParent(), this._lines.geometry.dispose(), this._lines.material.dispose(), this._lines = null), this._points !== null && (this._points.removeFromParent(), this._points.geometry.dispose(), this._points.material.dispose(), this._points.material.map.dispose(), this._points = null);
  }
  _getColor(e2, t2) {
    switch (this.colorMode) {
      case ko.ID:
        Oo.getColor(e2.id, t2);
        break;
      case ko.LEVEL:
        Oo.getColor(e2.lodLevel, t2);
        break;
      case ko.NAME:
        Oo.getColor(e2.properties.name, t2);
        break;
      case ko.TILE:
        Oo.getColor(...e2.range, t2);
        break;
      default:
        t2.set(16777215);
        break;
    }
  }
};
var Io = /* @__PURE__ */ new L4();
var Lo = /* @__PURE__ */ new L4();
var Ro = [0, 0];
var zo = class extends Ga {
  constructor() {
    super(), this.position = new L4(), this.lat = 0, this.lon = 0, this.radius = 28, this.screenPos = new L4(), this._facingRatio = 1;
  }
  updateTransform(e2, t2, n2, r2 = true) {
    let { position: i3, screenPos: a3 } = this;
    a3.copy(i3).applyMatrix4(e2), a3.x = (a3.x * 0.5 + 0.5) * t2.width, a3.y = (-a3.y * 0.5 + 0.5) * t2.height, a3.z = +(a3.z < -1 || a3.z > 1), n2 !== null && (!r2 || i3.lengthSq() > 0) ? (Io.subVectors(n2, i3).normalize(), r2 ? Lo.copy(i3).normalize() : Lo.set(0, 0, 1), this._facingRatio = Lo.dot(Io)) : this._facingRatio = 1;
  }
  evaluate(e2) {
    let { screenPos: t2, radius: n2, horizonCutoff: r2, _facingRatio: i3 } = this;
    return !this.ready || t2.z !== 0 || i3 < r2 || e2.test(t2.x, t2.y, n2) ? false : (e2.mark(t2.x, t2.y, n2), true);
  }
};
function Bo(e2, t2, n2, r2, i3, a3 = []) {
  let [o3, s3, c3, l3] = r2, { projection: u4 } = i3, d5 = e2.extent, f4 = e2.loadGeometry();
  for (let [r3] of f4) {
    let f5 = N4.lerp(o3, c3, r3.x / d5), p4 = r3.y / d5, m4 = i3.flipY ? N4.lerp(l3, s3, p4) : N4.lerp(s3, l3, p4), [h5, g5] = u4.fromNormalizedToCartographic(f5, m4, Ro), _6 = new zo();
    _6.id = `${t2}:${e2.id}`, _6.layer = t2, _6.properties = e2.properties, _6.lat = g5, _6.lon = h5, _6.lodLevel = n2, a3.push(_6);
  }
  return a3;
}
var Vo = {
  NONE: 0,
  LEVEL: 1,
  TILE: 2
};
var Ho = 600;
var Uo = 700;
var Wo = 10;
var Go = 50;
var Ko = class {
  get ColorMode() {
    return Vo;
  }
  constructor() {
    this.enabled = false, this._wasEnabled = false, this.hierarchy = null, this.tiles = null, this.tiling = null, this.colorMode = Vo.NONE, this._regions = {}, this._onToggleCallback = ({ x: e2, y: t2, level: n2, visible: r2 }) => {
      let i3 = `${e2}_${t2}_${n2}`;
      if (r2) {
        let { tiles: r3, tiling: a3 } = this, { surface: o3, group: s3 } = r3, [c3, l3, u4, d5] = a3.getTileBounds(e2, t2, n2, false, false), f4 = o3.isEllipsoid ? 1 : o3.scale.x / (2 * Math.PI * r3.ellipsoid.radius.x), p4 = {
          latStart: l3,
          latEnd: d5,
          lonStart: c3,
          lonEnd: u4,
          heightStart: (o3.isEllipsoid ? Ho : Wo) * f4,
          heightEnd: (o3.isEllipsoid ? Uo : Go) * f4,
          getCartographicToPosition: (e3, t3, n3, r4) => o3.getCartographicToPosition(e3, t3, n3, r4),
          getCartographicToNormal: (e3, t3, n3) => o3.getCartographicToNormal(e3, t3, n3)
        }, m4 = new sa(p4), h5 = new ca(p4);
        m4.material.depthWrite = false, m4.material.depthTest = false, m4.material.transparent = true, h5.material.transparent = true, h5.material.opacity = 0.1, h5.material.depthWrite = false;
        let g5 = new te3();
        g5.add(m4, h5), s3.add(g5), g5.updateMatrixWorld(true), this._regions[i3] = {
          helper: g5,
          x: e2,
          y: t2,
          level: n2
        };
      } else {
        let { helper: e3 } = this._regions[i3];
        e3.children.forEach((e4) => e4.dispose()), e3.removeFromParent(), delete this._regions[i3];
      }
    };
  }
  update() {
    let { enabled: e2, hierarchy: t2, _regions: n2 } = this;
    if (e2 !== this._wasEnabled && (this._wasEnabled = e2, e2 ? (t2.getVisibleTiles().forEach((e3) => {
      this._onToggleCallback(e3);
    }), t2.addEventListener("toggle", this._onToggleCallback)) : this.dispose()), e2) for (let e3 in n2) {
      let { x: t3, y: r2, level: i3, helper: a3 } = n2[e3];
      a3.children.forEach((e4) => {
        let { color: n3 } = e4.material;
        switch (this.colorMode) {
          case Vo.NONE:
            n3.set(16777215);
            break;
          case Vo.LEVEL:
            Oo.getColor(i3, n3);
            break;
          case Vo.TILE:
            Oo.getColor(t3, r2, i3, n3);
            break;
        }
      });
    }
  }
  dispose() {
    let { hierarchy: e2 } = this;
    e2.getVisibleTiles().forEach((e3) => {
      this._onToggleCallback({
        ...e3,
        visible: false
      });
    }), e2.removeEventListener("toggle", this._onToggleCallback);
  }
};
var qo = class {
  constructor() {
    this.added = /* @__PURE__ */ new Set(), this.removed = /* @__PURE__ */ new Set(), this.points = /* @__PURE__ */ new Set(), this._annotationsById = /* @__PURE__ */ new Map();
  }
  add(e2) {
    let { _annotationsById: t2, points: n2, added: r2 } = this, { id: i3 } = e2;
    if (!t2.has(i3)) t2.set(i3, {
      annotation: e2,
      ref: 0
    }), n2.add(e2), r2.add(e2);
    else {
      let n3 = t2.get(i3).annotation;
      e2.lodLevel > n3.lodLevel && (n3.lodLevel = e2.lodLevel, n3.lat = e2.lat, n3.lon = e2.lon);
    }
    t2.get(i3).ref++;
  }
  delete(e2) {
    let { _annotationsById: t2 } = this, { id: n2 } = e2, r2 = t2.get(n2);
    r2.ref--;
  }
  update() {
    let { removed: e2, points: t2, _annotationsById: n2 } = this;
    n2.forEach((r2, i3) => {
      r2.ref === 0 && (e2.add(r2.annotation), t2.delete(r2.annotation), n2.delete(i3));
    });
  }
  reset() {
    this.added.clear(), this.removed.clear();
  }
};
var Jo = class extends C4 {
  get isFull() {
    return this._freeList.length === 0 && this._nextIndex >= this._capacity;
  }
  get capacity() {
    return this._capacity;
  }
  get count() {
    return this._slots.size;
  }
  constructor(e2 = 32, t2 = 64) {
    super(null), this.generateMipmaps = false, this.slotSize = 0, this._columns = -1, this._capacity = -1, this._slots = /* @__PURE__ */ new Map(), this._freeList = [], this._nextIndex = 0, this._capacity = 0, this._columns = 0, this._uvs = /* @__PURE__ */ new Map(), this.resize(e2, t2), this.colorSpace = Ce2;
  }
  keys() {
    return this._slots.keys();
  }
  has(e2) {
    return this._slots.has(e2);
  }
  get(e2) {
    let { _slots: t2 } = this;
    return t2.has(e2) ? this._indexToSlot(t2.get(e2)) : null;
  }
  getSlotSize(e2) {
    let { slotSize: t2, image: n2 } = this;
    return e2.set(t2 / n2.width, t2 / n2.height);
  }
  getUV(e2) {
    let { _slots: t2, _uvs: n2 } = this, r2 = t2.get(e2);
    return n2.get(r2);
  }
  drawChar(e2, t2, n2 = {}) {
    let { font: r2 = "", color: i3 = "white", strokeStyle: a3 = null, strokeWidth: o3 = 1 } = n2;
    return this._draw(e2, (e3, n3, s3, c3, l3) => {
      let u4 = n3 + c3 / 2, d5 = s3 + l3 / 2, f4 = this.measureChar(t2, r2), p4 = u4 - (f4.actualBoundingBoxRight + f4.actualBoundingBoxLeft) / 2, m4 = d5 + l3 / 4;
      a3 !== null && (e3.font = r2, e3.lineJoin = "round", e3.lineWidth = o3 * 2, e3.strokeStyle = a3, e3.strokeText(t2, p4, m4)), e3.font = r2, e3.fillStyle = i3, e3.fillText(t2, p4, m4);
    });
  }
  measureChar(e2, t2) {
    let { ctx: n2 } = this;
    return n2.font = t2, n2.measureText(e2);
  }
  drawImage(e2, t2) {
    return this._draw(e2, (e3, n2, r2, i3, a3) => {
      e3.drawImage(t2, n2, r2, i3, a3);
    });
  }
  drawPath(e2, t2, n2 = {}) {
    let { fillStyle: r2 = null, strokeStyle: i3 = null, lineWidth: a3 = 1 } = n2;
    return this._draw(e2, (e3, n3, o3) => {
      e3.save(), e3.translate(n3, o3), r2 !== null && (e3.fillStyle = r2, e3.fill(t2)), i3 !== null && (e3.strokeStyle = i3, e3.lineWidth = a3, e3.stroke(t2)), e3.restore();
    });
  }
  drawSVG(e2, t2, n2 = {}) {
    let { fillStyle: r2 = "white", strokeStyle: i3 = null, strokeWidth: a3 = 1, iconScale: o3 = 1 } = n2, s3 = new DOMParser().parseFromString(t2, "image/svg+xml").documentElement, c3 = (s3.getAttribute("viewBox") ?? "0 0 15 15").trim().split(/[\s,]+/), l3 = parseFloat(c3[2]), u4 = parseFloat(c3[3]), d5 = [...s3.querySelectorAll("path")].map((e3) => e3.getAttribute("d")).filter(Boolean).map((e3) => new Path2D(e3));
    return this._draw(e2, (e3, t3, n3, s4, c4) => {
      let f4 = s4 * o3, p4 = c4 * o3, m4 = Math.min(f4 / l3, p4 / u4), h5 = t3 + (s4 - l3 * m4) / 2, g5 = n3 + (c4 - u4 * m4) / 2;
      if (e3.save(), e3.translate(h5, g5), e3.scale(m4, m4), e3.lineJoin = "round", e3.lineCap = "round", i3 !== null) {
        e3.lineWidth = a3 * 2 / m4, e3.strokeStyle = i3;
        for (let t4 of d5) e3.stroke(t4);
      }
      if (r2 !== null) {
        e3.fillStyle = r2;
        for (let t4 of d5) e3.fill(t4);
      }
      e3.restore();
    });
  }
  release(e2) {
    let { _slots: t2, _freeList: n2 } = this;
    if (!t2.has(e2)) return;
    let r2 = t2.get(e2);
    n2.push(r2), t2.delete(e2);
  }
  resize(e2, t2 = this.slotSize) {
    let n2 = this.image, r2 = this._columns, i3 = this.slotSize, a3 = Math.ceil(Math.sqrt(e2)), o3 = document.createElement("canvas");
    o3.width = a3 * t2, o3.height = a3 * t2;
    let s3 = o3.getContext("2d");
    for (let e3 of this._slots.values()) {
      let o4 = e3 % r2 * i3, c3 = Math.floor(e3 / r2) * i3, l3 = e3 % a3 * t2, u4 = Math.floor(e3 / a3) * t2;
      s3.drawImage(n2, o4, c3, i3, i3, l3, u4, t2, t2);
    }
    this.dispose(), this.image = o3, this.ctx = s3, this.slotSize = t2, this._columns = a3, this._capacity = e2;
    for (let e3 of this._slots.values()) this._updateUV(e3);
    this.needsUpdate = true;
  }
  clear() {
    this._slots.clear(), this._freeList.length = 0, this._nextIndex = 0, this.ctx.clearRect(0, 0, this.image.width, this.image.height), this.needsUpdate = true;
  }
  _draw(e2, t2) {
    let { ctx: n2, _freeList: r2, _capacity: i3, _slots: a3 } = this, o3;
    if (a3.has(e2)) o3 = a3.get(e2);
    else {
      if (r2.length > 0) o3 = r2.pop();
      else if (this._nextIndex < i3) o3 = this._nextIndex++;
      else throw Error("MVTGlyphAtlasTexture: atlas is full. Call resize() to increase capacity.");
      a3.set(e2, o3);
    }
    let s3 = this._indexToSlot(o3);
    return n2.save(), n2.beginPath(), n2.rect(s3.x, s3.y, s3.w, s3.h), n2.clip(), n2.clearRect(s3.x, s3.y, s3.w, s3.h), t2(n2, s3.x, s3.y, s3.w, s3.h), n2.restore(), this._updateUV(o3), this.needsUpdate = true, s3;
  }
  _indexToSlot(e2) {
    let { _columns: t2, slotSize: n2 } = this;
    return {
      x: e2 % t2 * n2,
      y: Math.floor(e2 / t2) * n2,
      w: n2,
      h: n2
    };
  }
  _updateUV(e2) {
    let { slotSize: t2, image: n2, _uvs: r2 } = this, { width: i3, height: a3 } = n2, o3 = this._indexToSlot(e2);
    r2.set(e2, {
      x: o3.x / i3,
      y: (a3 - o3.y) / a3,
      w: t2 / i3,
      h: t2 / a3
    });
  }
};
var Yo = /* @__PURE__ */ new Me2();
var Xo = class extends he2 {
  get glyphAtlas() {
    return this._glyphAtlas;
  }
  set glyphAtlas(e2) {
    this._glyphAtlas = e2, e2 !== null && e2.getSlotSize(this._glyphCellSize), this._uniforms && (this._uniforms.glyphAtlas.value = e2);
  }
  get glyphCellSize() {
    return this._glyphCellSize;
  }
  constructor(e2 = {}) {
    let { size: t2 = 25, sizeAttenuation: n2 = false, ...r2 } = e2;
    super({
      size: t2,
      sizeAttenuation: n2,
      ...r2
    }), this.transparent = true, this.depthTest = false, this.depthWrite = false, this.resolution = new I4(), this._glyphCellSize = new I4(), this._glyphAtlas = new Jo(), this._uniforms = null, this.onBeforeCompile = (e3) => {
      e3.uniforms.glyphAtlas = { value: this._glyphAtlas }, e3.uniforms.glyphCellSize = { value: this._glyphCellSize }, this._uniforms = e3.uniforms, e3.vertexShader = e3.vertexShader.replace("#include <color_pars_vertex>", "\n					#include <color_pars_vertex>\n					attribute vec2 glyphUV;\n					attribute float alpha;\n					attribute float angle;\n					varying vec2 vGlyphUV;\n					varying float vAlpha;\n					varying float vAngle;\n				"), e3.vertexShader = e3.vertexShader.replace("#include <color_vertex>", "\n					#include <color_vertex>\n					vGlyphUV = glyphUV;\n					vAlpha = alpha;\n					vAngle = angle;\n				"), e3.fragmentShader = "\n\n					uniform sampler2D glyphAtlas;\n					uniform vec2 glyphCellSize;\n					uniform float opacity;\n					varying vec2 vGlyphUV;\n					varying float vAlpha;\n					varying float vAngle;\n\n					void main() {\n\n						vec4 diffuseColor = vec4( 0.0 );\n						if ( vGlyphUV.x >= 0.0 ) {\n\n							// rotate the point-sprite lookup around its center so the glyph follows\n							// the path direction; clamp keeps the rotated corners inside the slot\n							vec2 pc = gl_PointCoord - 0.5;\n							float c = cos( vAngle );\n							float s = sin( vAngle );\n							pc = vec2( c * pc.x + s * pc.y, - s * pc.x + c * pc.y ) + 0.5;\n							pc = clamp( pc, 0.0, 1.0 );\n\n							vec4 glyph = texture2D( glyphAtlas, vGlyphUV + pc * glyphCellSize * vec2( 1.0, - 1.0 ) );\n							diffuseColor = glyph;\n\n						}\n\n						diffuseColor.a *= vAlpha * opacity;\n						gl_FragColor = diffuseColor;\n\n						#include <tonemapping_fragment>\n						#include <colorspace_fragment>\n						#include <premultiplied_alpha_fragment>\n\n\n					}\n\n\n			";
    };
  }
  onBeforeRender(e2) {
    this._glyphAtlas.getSlotSize(this._glyphCellSize), e2.getViewport(Yo), this.resolution.set(Yo.z, Yo.w);
  }
};
var Zo = /* @__PURE__ */ new P4();
var Z4 = /* @__PURE__ */ new Me2();
var Qo = /* @__PURE__ */ new Me2();
var $o = /* @__PURE__ */ new I4();
var es = /* @__PURE__ */ new I4();
var ts = /* @__PURE__ */ new L4();
var ns = /* @__PURE__ */ Object.freeze({
  OBSCURED: 0,
  DRAW_THROUGH: 1,
  OVERLAY: 2
});
var rs = class extends te3 {
  static get DrawMode() {
    return ns;
  }
  get size() {
    return this._opaque.material.size;
  }
  set size(e2) {
    this._opaque.material.size = e2, this._drawThrough.material.size = e2;
  }
  get glyphAtlas() {
    return this._opaque.material.glyphAtlas;
  }
  get drawMode() {
    return this._drawMode;
  }
  set drawMode(e2) {
    this._drawMode = e2, this._applyDrawMode();
  }
  get geometry() {
    return this._opaque.geometry;
  }
  constructor(e2) {
    super(), this.frustumCulled = false, this.fadeInDuration = 0.3, this.fadeOutDuration = 0.3, this.drawThroughOpacity = 0.5, this._entryMap = /* @__PURE__ */ new Map(), this._orderedEntries = [], this._lastUpdateTime = -1, this._lastCamera = null;
    let t2 = new S4(), n2 = new me2(t2, new Xo());
    n2.frustumCulled = false, n2.renderOrder = 1e3, n2.onAfterRender = (e3, t3, n3) => {
      this._lastCamera = n3;
    };
    let r2 = new me2(t2, new Xo());
    r2.frustumCulled = false, r2.material.glyphAtlas = n2.material.glyphAtlas, r2.renderOrder = 1001, r2.onAfterRender = (e3, t3, n3) => {
      this._lastCamera = n3;
    }, this.add(r2, n2), this._opaque = n2, this._drawThrough = r2, this.drawMode = ns.OVERLAY;
  }
  dispose() {
    this.glyphAtlas.dispose(), this.geometry.dispose(), this._opaque.material.dispose(), this._drawThrough.material.dispose();
  }
  update(e2, t2) {
    let n2 = performance.now() / 1e3, r2 = this._lastUpdateTime < 0 ? 0 : Math.min(n2 - this._lastUpdateTime, 0.1);
    this._lastUpdateTime = n2;
    let { _entryMap: i3, _orderedEntries: a3, fadeInDuration: o3, fadeOutDuration: s3 } = this;
    for (let t3 of e2) {
      let e3 = i3.get(t3.id);
      if (e3) e3.item = t3, e3.state === "out" && (e3.state = "in");
      else {
        let e4 = {
          item: t3,
          fade: 0,
          state: "in"
        };
        i3.set(t3.id, e4), a3.push(e4);
      }
    }
    for (let e3 of t2) {
      let t3 = i3.get(e3.id);
      t3 && t3.state !== "out" && (t3.state = "out");
    }
    let c3 = false;
    for (let [e3, t3] of i3) t3.state === "in" ? (t3.fade = Math.min(1, t3.fade + r2 / o3), t3.fade >= 1 && (t3.state = "visible")) : t3.state === "out" && (t3.fade = Math.max(0, t3.fade - r2 / s3), t3.fade <= 0 && (i3.delete(e3), c3 = true));
    c3 && (this._orderedEntries = a3.filter((e3) => i3.has(e3.item.id))), this._recenter(), this._updateGeometry();
  }
  raycast(e2, t2) {
    let n2 = e2.camera;
    if (!n2) return;
    let { geometry: r2, matrixWorld: i3 } = this, { material: a3 } = this._opaque, { resolution: o3 } = a3, s3 = r2.getAttribute("position");
    if (!s3 || s3.count === 0) return;
    let c3 = a3.size / 2, l3 = -n2.near;
    e2.ray.at(1, Qo), Qo.w = 1, Qo.applyMatrix4(n2.matrixWorldInverse), Qo.applyMatrix4(n2.projectionMatrix), Qo.multiplyScalar(1 / Qo.w), $o.set(Qo.x * o3.x / 2, Qo.y * o3.y / 2), Zo.multiplyMatrices(n2.matrixWorldInverse, i3);
    for (let a4 = 0, u4 = r2.drawRange.count; a4 < u4; a4++) {
      if (Z4.fromBufferAttribute(s3, a4), Z4.w = 1, Z4.applyMatrix4(Zo), Z4.z > l3 || (Z4.applyMatrix4(n2.projectionMatrix), Z4.multiplyScalar(1 / Z4.w), Z4.z < -1 || Z4.z > 1) || (es.set(Z4.x * o3.x / 2, Z4.y * o3.y / 2), $o.distanceTo(es) > c3)) continue;
      ts.fromBufferAttribute(s3, a4).applyMatrix4(i3);
      let r3 = this._orderedEntries[a4];
      t2.push({
        distance: e2.ray.origin.distanceTo(ts),
        point: ts.clone(),
        index: a4,
        face: null,
        faceIndex: null,
        object: this,
        layer: r3?.item.layer ?? null,
        properties: r3?.item.properties ?? null
      });
    }
    return false;
  }
  _applyDrawMode() {
    let { _opaque: e2, _drawThrough: t2, drawThroughOpacity: n2, _drawMode: r2 } = this;
    switch (r2) {
      case ns.OVERLAY:
        e2.visible = true, e2.material.depthTest = false, t2.visible = false;
        break;
      case ns.DRAW_THROUGH:
        e2.visible = true, e2.material.depthTest = true, t2.visible = true, t2.material.opacity = n2, t2.material.depthFunc = ee3;
        break;
      case ns.OBSCURED:
      default:
        e2.visible = true, e2.material.depthTest = true, t2.visible = false;
        break;
    }
  }
  _recenter() {
    let { parent: e2, _lastCamera: t2 } = this;
    if (!t2) {
      this.position.set(0, 0, 0), this.updateMatrixWorld(true);
      return;
    }
    e2 ? Zo.copy(e2.matrixWorld).invert() : Zo.identity(), this.position.setFromMatrixPosition(t2.matrixWorld).applyMatrix4(Zo), this.updateMatrixWorld(true);
  }
  _updateGeometry() {
  }
  _resizeGeometry(e2) {
    let { geometry: t2 } = this, n2 = t2.getAttribute("position");
    (!n2 || n2.count < e2) && (t2.dispose(), t2.setAttribute("position", new x5(new Float32Array(e2 * 3), 3)), t2.setAttribute("glyphUV", new x5(new Float32Array(e2 * 2), 2)), t2.setAttribute("alpha", new x5(new Float32Array(e2), 1)), t2.setAttribute("angle", new x5(new Float32Array(e2), 1))), t2.setDrawRange(0, e2);
  }
  _writeGlyph(e2, t2, n2, r2, i3 = 0) {
    let { geometry: a3, glyphAtlas: o3 } = this, s3 = this.position, { position: c3, glyphUV: l3, alpha: u4, angle: d5 } = a3.attributes;
    if (c3.setXYZ(e2, t2.x - s3.x, t2.y - s3.y, t2.z - s3.z), n2 !== null && o3.has(n2)) {
      let t3 = o3.getUV(n2);
      l3.setXY(e2, t3.x, t3.y);
    } else l3.setXY(e2, -1, -1);
    u4.setX(e2, r2), d5.setX(e2, i3);
  }
  _markNeedsUpdate() {
    let { geometry: e2 } = this;
    e2.getAttribute("position").needsUpdate = true, e2.getAttribute("glyphUV").needsUpdate = true, e2.getAttribute("alpha").needsUpdate = true, e2.getAttribute("angle").needsUpdate = true;
  }
};
var is = class extends rs {
  constructor(e2 = {}) {
    let { getKind: t2 = () => null, fallback: n2 = null, size: r2 = 18, glyphSize: i3 = 18 * window.devicePixelRatio, slotCount: a3 = 64 } = e2;
    super(), this.getKind = t2, this.fallback = n2, this.size = r2, this.glyphAtlas.resize(a3, i3);
  }
  _updateGeometry() {
    let { _orderedEntries: e2, getKind: t2, glyphAtlas: n2, fallback: r2 } = this, i3 = e2.length;
    this._resizeGeometry(i3);
    for (let a3 = 0; a3 < i3; a3++) {
      let { item: i4, fade: o3 } = e2[a3], s3 = t2(i4.layer, i4.properties);
      (s3 === null || !n2.has(s3)) && (s3 = r2), this._writeGlyph(a3, i4.position, s3, o3);
    }
    this._markNeedsUpdate();
  }
};
var as = /* @__PURE__ */ new Set();
var os = class extends rs {
  constructor(e2 = {}) {
    let { size: t2 = 16, glyphSize: n2 = 16 * window.devicePixelRatio, slotCount: r2 = 64, font: i3 = null, fontFamily: a3 = "sans-serif", strokeStyle: o3 = "black", strokeWidth: s3 = 0 } = e2;
    super();
    let c3 = Math.round(n2 * 0.7);
    this._font = i3 ?? `400 ${c3}px ${a3}`, this._advanceCache = /* @__PURE__ */ new Map(), this._strokeStyle = o3, this._strokeWidth = s3, this.glyphAtlas.resize(r2, n2), this.size = t2;
  }
  reset() {
    this._advanceCache.clear(), this.glyphAtlas.clear();
  }
  measureChar(e2) {
    let { _advanceCache: t2, glyphAtlas: n2, _font: r2 } = this;
    if (!t2.has(e2)) {
      let i3 = this.size / n2.slotSize, a3 = n2.measureChar(e2, r2).width + 2;
      t2.set(e2, a3 * i3);
    }
    return t2.get(e2);
  }
  _drawChar(e2, t2) {
    let { glyphAtlas: n2 } = this;
    if (n2.capacity === n2.count) {
      let e3 = null;
      for (let r2 of n2.keys()) if (!t2.has(r2)) {
        e3 = r2;
        break;
      }
      e3 === null ? n2.resize(n2.capacity * 2) : n2.release(e3);
    }
    n2.drawChar(e2, e2, {
      font: this._font,
      color: "white",
      strokeStyle: this._strokeStyle,
      strokeWidth: this._strokeWidth
    });
  }
  _updateGeometry() {
    let { _orderedEntries: e2, glyphAtlas: t2 } = this;
    as.clear();
    let n2 = 0;
    for (let t3 of e2) {
      let { text: e3, characterPositions: r3 } = t3.item;
      n2 += r3.length;
      for (let t4 = 0, n3 = e3.length; t4 < n3; t4++) as.add(e3[t4]);
    }
    for (let e3 of as) t2.has(e3) || this._drawChar(e3, as);
    this._resizeGeometry(n2);
    let r2 = 0;
    for (let t3 of e2) {
      let e3 = t3.item, { fade: n3 } = t3, i3 = e3.characterPositions, a3 = e3.characterAngles, o3 = e3.text;
      for (let e4 = 0, t4 = i3.length; e4 < t4; e4++) this._writeGlyph(r2++, i3[e4], o3[e4], n3, a3[e4]);
    }
    this._markNeedsUpdate(), as.clear();
  }
};
var ss = class {
  get hasPendingWork() {
    return this._queue.size > 0;
  }
  constructor() {
    this.callback = function* () {
    }, this.maxUpdateTimeMs = 1, this._queue = /* @__PURE__ */ new Map(), this._tasks = /* @__PURE__ */ new Map(), this._deadline = 0, this._isDeadlineComplete = () => performance.now() >= this._deadline;
  }
  add(e2, t2) {
    this._tasks.delete(e2), this._queue.set(e2, t2);
  }
  delete(e2) {
    this._queue.delete(e2), this._tasks.delete(e2);
  }
  update(e2 = this.maxUpdateTimeMs) {
    let { _queue: t2, _tasks: n2, _isDeadlineComplete: r2 } = this;
    this._deadline = performance.now() + e2;
    for (let [e3, i3] of t2) {
      let a3 = n2.get(e3);
      if (a3 || (a3 = this.callback(i3, r2), n2.set(e3, a3)), a3.next().done && (t2.delete(e3), n2.delete(e3)), r2()) break;
    }
  }
  clear() {
    this._queue.clear(), this._tasks.clear();
  }
};
var cs = 4095;
var ls = /* @__PURE__ */ new P4();
function us(e2) {
  let t2 = [];
  return e2.traverse((e3) => {
    e3.isMesh && t2.push(e3);
  }), t2;
}
var ds = class {
  set needsUpdate(e2) {
    e2 && this.version++;
  }
  constructor() {
    this.group = new te3(), this.performSettleRaycast = null, this.sampleCartographicElevation = null, this.version = 0;
  }
  filterAnnotation(e2, t2, n2) {
    return false;
  }
  getAnnotationRank(e2) {
    return e2.properties.rank ?? Infinity;
  }
  measureChar(e2, t2, n2) {
    return 1;
  }
  getText(e2) {
    return e2.name ?? "";
  }
  isAnnotationEnabled(e2, t2, n2) {
    return true;
  }
  onPointsUpdate(e2, t2) {
  }
  onLabelsUpdate(e2, t2) {
  }
  dispose() {
  }
};
function fs(e2) {
  let t2 = [], n2 = [];
  for (let r2 of e2) r2 instanceof To ? n2.push(r2) : t2.push(r2);
  return {
    points: t2,
    labels: n2
  };
}
var ps = class extends ds {
  constructor() {
    super();
    let e2 = window.devicePixelRatio, t2 = new is({ fallback: "default" });
    t2.glyphAtlas.drawChar("default", "\u25CF", {
      fillStyle: "white",
      strokeStyle: "black",
      strokeWidth: 3 * e2,
      font: "30px sans-serif"
    });
    let n2 = new os({
      fontFamily: "Arial",
      strokeStyle: "black",
      strokeWidth: 3 * e2
    });
    this.group.add(t2, n2), this.icons = t2, this.labels = n2;
  }
  filterAnnotation(e2, t2, n2) {
    return true;
  }
  measureChar(e2, t2, n2) {
    return this.labels.measureChar(e2);
  }
  onPointsUpdate(e2, t2) {
    this.icons.update(e2, t2);
  }
  onLabelsUpdate(e2, t2) {
    this.labels.update(e2, t2);
  }
  dispose() {
    this.icons.dispose(), this.labels.dispose();
  }
};
var ms = class {
  get contentCache() {
    return this.overlay.imageSource._contentCache;
  }
  get maxSettleTimeMs() {
    return this.settlingManager.maxSettleTimeMs;
  }
  set maxSettleTimeMs(e2) {
    this.settlingManager.maxSettleTimeMs = e2;
  }
  get maxOccupancyUpdateTimeMs() {
    return this.occupancy.maxUpdateTimeMs;
  }
  set maxOccupancyUpdateTimeMs(e2) {
    this.occupancy.maxUpdateTimeMs = e2;
  }
  get maxParseTimeMs() {
    return this.toggleTileQueue.maxUpdateTimeMs;
  }
  set maxParseTimeMs(e2) {
    this.toggleTileQueue.maxUpdateTimeMs = e2;
  }
  get horizonCutoff() {
    return this._horizonCutoff;
  }
  set horizonCutoff(e2) {
    e2 !== this._horizonCutoff && (this._horizonCutoff = e2, this.pointManager.points.forEach((t2) => t2.horizonCutoff = e2), this.anchorManager.lines.forEach((t2) => t2.horizonCutoff = e2), this.occupancy.needsUpdate = true);
  }
  get resolution() {
    return this._resolution;
  }
  set resolution(e2) {
    if (e2 === this._resolution) return;
    let { tiles: t2, tileLoadState: n2 } = this;
    t2 !== null && n2.forEach((e3, n3) => {
      t2.visibleTiles.has(n3) && this._markVectorTile(n3, false), this._prefetchVectorTile(n3, false);
    }), this._resolution = e2, t2 !== null && n2.forEach((e3, n3) => {
      this._prefetchVectorTile(n3, true), t2.visibleTiles.has(n3) && this._markVectorTile(n3, true);
    });
  }
  constructor(e2 = {}) {
    this.priority = Infinity, this.name = "MVT_ANNOTATIONS_PLUGIN";
    let { overlay: t2, camera: n2 = null, driver: r2 = new ps(), resolution: i3 = 50, horizonCutoff: a3 = 0.1, useIdleCallback: o3 = true } = e2;
    this.overlay = t2, this.camera = n2, this.driver = r2, this.tiles = null, this._resolution = i3, this._horizonCutoff = a3, this.useIdleCallback = o3, this._idleCallbackHandle = -1, this._measureChar = (e3) => this.driver.measureChar(e3), this._filterAnnotation = (e3, t3, n3) => this.driver.filterAnnotation(e3, t3, n3), this._driverVersion = -1, this.hierarchy = new Va(), this.occupancy = new qa(), this.anchorManager = new Eo(), this.pointManager = new qo(), this.settlingManager = new fo(), this.tileLoadState = /* @__PURE__ */ new Map(), this.vectorTileInfo = /* @__PURE__ */ new Map(), this.toggleTileQueue = new ss(), this.debug = {
      occupancy: new Do(this.occupancy),
      paths: new Fo(this.anchorManager),
      hierarchy: new Ko()
    };
  }
  async init(e2) {
    this.tiles = e2, this.driver.group.parent === null && (e2.group.add(this.driver.group), this.driver.group.updateMatrixWorld());
    let { overlay: t2, occupancy: n2, debug: r2, hierarchy: i3, settlingManager: a3, contentCache: o3, pointManager: s3, anchorManager: c3, toggleTileQueue: l3 } = this;
    r2.paths.group = e2.group, r2.hierarchy.hierarchy = i3, r2.hierarchy.tiles = e2, r2.hierarchy.tiling = t2.tiling, a3.occupancy = n2, a3.tiles = e2, i3.contentCache = o3, t2.init(), t2.isReady || await t2.whenReady(), this.driver.sortAnnotations && console.warn('MVTAnnotationsDriver: "sortAnnotations" has been deprecated. Implement "getAnnotationRank" instead.'), n2.sortValueCallback = (e3) => {
      let t3 = +!n2.visible.has(e3), r3 = Math.min(Math.max(Math.floor(this.driver.getAnnotationRank(e3)), 0), cs);
      return t3 * 4096 + r3;
    }, this._onVisibilityChange = ({ scene: e3, tile: t3, visible: n3 }) => {
      a3.needsUpdate = true, this._markVectorTile(t3, n3);
    }, this._onUpdateAfter = () => {
      let { driver: t3, camera: o4, _measureChar: u4 } = this, d5 = t3.version !== this._driverVersion;
      if (this._driverVersion = t3.version, d5) {
        for (let e3 of s3.points) e3.enabled = t3.isAnnotationEnabled(e3.layer, e3.properties, 1);
        for (let e3 of c3.lines) e3.enabled = t3.isAnnotationEnabled(e3.layer, e3.properties, 2), e3.text = t3.getText(e3.properties), e3.updateCharacterWidthCache(u4);
        a3.needsUpdate = true, n2.needsUpdate = true;
      }
      o4 !== null && (e2.getResolution(o4, n2.resolution), n2.matrix.copy(e2.group.matrixWorld), n2.useEllipsoidSurface = !!e2.surface.isEllipsoid), i3.update(), l3.update(), s3.update(), s3.added.forEach((e3) => {
        n2.register(e3), a3.register(e3);
      }), s3.removed.forEach((e3) => {
        n2.unregister(e3), a3.unregister(e3);
      }), s3.reset(), c3.update(), c3.added.forEach((e3) => {
        n2.register(e3);
      }), c3.removed.forEach((e3) => {
        n2.unregister(e3);
      }), c3.reset(), n2.needsUpdate = n2.needsUpdate || a3.hasPendingWork, a3.camera = o4, a3.performSettleRaycast = t3.performSettleRaycast, a3.elevationSource = t3.sampleCartographicElevation === null ? e2.plugins.find((e3) => e3.sampleCartographicElevation) || null : t3, a3.update(), n2.camera = o4, n2.update(), d5 && (n2.flush(), n2.finishAnimations());
      let f4 = fs(n2.added), p4 = fs(n2.removed);
      this.driver.onPointsUpdate(f4.points, p4.points), this.driver.onLabelsUpdate(f4.labels, p4.labels), (n2.added.size > 0 || n2.removed.size > 0) && e2.dispatchEvent({ type: "needs-render" }), n2.reset(), (n2.hasPendingWork || a3.hasPendingWork || l3.hasPendingWork) && (e2.dispatchEvent({ type: "needs-update" }), this.useIdleCallback && this._idleCallbackHandle === -1 && (this._idleCallbackHandle = requestIdleCallback((e3) => {
        this._idleCallbackHandle = -1, n2.needsUpdate = n2.needsUpdate || a3.hasPendingWork, l3.update(e3.timeRemaining() * 0.9), a3.update(e3.timeRemaining() * 0.9), n2.update(e3.timeRemaining() * 0.9);
      }))), r2.paths.camera = this.camera, r2.occupancy.update(), r2.paths.update(), r2.hierarchy.update();
    }, this._onVectorTileToggle = ({ x: t3, y: n3, level: r3, visible: i4 }) => {
      e2.dispatchEvent({ type: "needs-update" });
      let a4 = `${t3}_${n3}_${r3}`;
      i4 === this.vectorTileInfo.has(a4) ? l3.delete(a4) : l3.add(a4, {
        x: t3,
        y: n3,
        level: r3,
        visible: i4
      });
    }, this._onTileDownloadStart = ({ tile: e3, url: t3 }) => {
      !/\.json$/i.test(t3) && !/\.subtree/i.test(t3) && this._initTileRange(e3);
    }, l3.callback = function* ({ x: n3, y: r3, level: i4, visible: a4 }, o4) {
      let { contentCache: s4, driver: c4, vectorTileInfo: l4, settlingManager: u4, anchorManager: d5, pointManager: f4, _filterAnnotation: p4, _measureChar: m4 } = this, h5 = `${n3}_${r3}_${i4}`;
      if (a4) {
        let { tiling: a5 } = t2, g5 = s4.get(n3, r3, i4);
        if (!g5) {
          l4.set(h5, { annotations: [] });
          return;
        }
        let _6 = [], v6 = a5.getTileBounds(n3, r3, i4, true, false), y6 = a5.getTileBounds(n3, r3, i4, false, false);
        for (let t3 in g5.layers) {
          let n4 = g5.layers[t3];
          for (let r4 = 0; r4 < n4.length; r4++) {
            o4() && (yield);
            let s5 = n4.feature(r4), { type: c5 } = s5;
            c5 !== 1 && c5 !== 2 || p4(t3, s5.properties, c5) && (c5 === 1 ? Bo(s5, t3, i4, v6, a5, _6) : no(s5, t3, i4, v6, y6, a5, e2.ellipsoid, _6));
          }
        }
        let b6 = [];
        for (let e3 of _6) e3.horizonCutoff = this._horizonCutoff, e3 instanceof eo ? (b6.push(e3), u4.register(e3), e3.enabled = c4.isAnnotationEnabled(e3.layer, e3.properties, 2), e3.text = c4.getText(e3.properties), e3.updateCharacterWidthCache(m4)) : (f4.add(e3), e3.enabled = c4.isAnnotationEnabled(e3.layer, e3.properties, 1));
        d5.addLines(b6), l4.set(h5, { annotations: _6 });
      } else {
        let { annotations: e3 } = l4.get(h5);
        l4.delete(h5);
        let t3 = [];
        for (let n4 of e3) n4 instanceof eo ? (t3.push(n4), u4.unregister(n4)) : f4.delete(n4);
        d5.deleteLines(t3);
      }
    }.bind(this), i3.addEventListener("toggle", this._onVectorTileToggle), e2.addEventListener("update-after", this._onUpdateAfter), e2.addEventListener("tile-visibility-change", this._onVisibilityChange), e2.addEventListener("tile-download-start", this._onTileDownloadStart), e2.forEachLoadedModel((t3, n3) => {
      this.processTileModel(t3, n3), e2.visibleTiles.has(n3) && this._markVectorTile(n3, true);
    });
  }
  dispose() {
    let { debug: e2, tiles: t2, hierarchy: n2, driver: r2, settlingManager: i3, toggleTileQueue: a3, tileLoadState: o3 } = this;
    e2.occupancy.dispose(), e2.paths.dispose(), r2.group.removeFromParent(), r2.dispose(), n2.removeEventListener("toggle", this._onVectorTileToggle), t2.removeEventListener("update-after", this._onUpdateAfter), t2.removeEventListener("tile-visibility-change", this._onVisibilityChange), t2.removeEventListener("tile-download-start", this._onTileDownloadStart), o3.forEach((e3, n3) => {
      t2.visibleTiles.has(n3) && this._markVectorTile(n3, false), this._prefetchVectorTile(n3, false);
    }), a3.clear(), this._idleCallbackHandle !== -1 && (cancelIdleCallback(this._idleCallbackHandle), this._idleCallbackHandle = -1), i3.elevationSource = null;
  }
  disposeTile(e2) {
    this.tileLoadState.has(e2) && (this._prefetchVectorTile(e2, false), this.tileLoadState.delete(e2));
  }
  async processTileModel(e2, t2) {
    let { tiles: n2, overlay: r2 } = this;
    if (this.tileLoadState.has(t2)) return;
    r2.isReady || await r2.whenReady(), ls.identity(), e2.parent !== null && ls.copy(n2.group.matrixWorldInverse), e2.updateMatrixWorld();
    let { range: i3 } = Ot2(us(e2), n2.surface, ls, r2.projection);
    this.tileLoadState.set(t2, i3), this._prefetchVectorTile(t2, true);
  }
  _initTileRange(e2) {
    let { overlay: t2, tileLoadState: n2 } = this;
    if (!t2.isReady || n2.has(e2) || !e2.boundingVolume.region) return;
    let [r2, i3, a3, o3] = e2.boundingVolume.region, s3 = [
      r2,
      i3,
      a3,
      o3
    ];
    s3 = t2.projection.clampToBounds(s3), s3 = t2.projection.fromCartographicToNormalizedRange(s3), n2.set(e2, s3), this._prefetchVectorTile(e2, true);
  }
  _prefetchVectorTile(e2, t2) {
    let n2 = this.tileLoadState.get(e2);
    this._forEachTileInBounds(n2, (e3, n3, r2) => {
      this.hierarchy.setPrefetchState(e3, n3, r2, t2);
    });
  }
  _markVectorTile(e2, t2) {
    let n2 = this.tileLoadState.get(e2);
    n2 !== void 0 && this._forEachTileInBounds(n2, (e3, n3, r2) => {
      this.hierarchy.setTargetState(e3, n3, r2, t2);
    });
  }
  _forEachTileInBounds(e2, t2) {
    let { overlay: n2, resolution: r2 } = this, { tiling: i3 } = n2, a3 = n2.calculateLevel(e2, r2);
    if (!n2.isReady) throw Error("MVTAnnotationsPlugin: overlay is not ready.");
    Et2(e2, a3, i3, t2);
  }
};
var hs = /* @__PURE__ */ new w4();
function gs(e2, t2) {
  let n2 = "r/", r2 = e2.slice(1), i3 = Math.floor(r2.length / t2);
  for (let e3 = 0; e3 < i3; e3++) n2 += r2.substr(e3 * t2, t2) + "/";
  return n2.slice(0, -1);
}
var _s = {
  POSITION_CARTESIAN: {
    name: "position",
    size: 12,
    type: "int32"
  },
  COLOR_PACKED: {
    name: "rgba",
    size: 4,
    type: "uint8"
  },
  RGB: {
    name: "rgb",
    size: 3,
    type: "uint8"
  },
  RGBA: {
    name: "rgba",
    size: 4,
    type: "uint8"
  },
  INTENSITY: {
    name: "intensity",
    size: 2,
    type: "uint16"
  },
  INTENSITY_GRADIENT: {
    name: "intensity gradient",
    size: 2,
    type: "uint16"
  },
  CLASSIFICATION: {
    name: "classification",
    size: 1,
    type: "uint8"
  },
  NORMAL_FLOATS: {
    name: "normal floats",
    size: 12,
    type: "float32"
  },
  NORMAL_SPHEREMAPPED: {
    name: "normal spheremapped",
    size: 2,
    type: "uint8"
  },
  NORMAL_OCT16: {
    name: "normal oct16",
    size: 2,
    type: "uint8"
  },
  GPS_TIME: {
    name: "gps-time",
    size: 8,
    type: "float64"
  },
  RETURN_NUMBER: {
    name: "return number",
    size: 1,
    type: "uint8"
  },
  NUMBER_OF_RETURNS: {
    name: "number of returns",
    size: 1,
    type: "uint8"
  },
  SOURCE_ID: {
    name: "point source id",
    size: 2,
    type: "uint16"
  },
  RGB565: {
    name: "rgb565",
    size: 2,
    type: "uint16"
  }
};
function vs(e2) {
  let { scale: t2 } = e2, n2 = e2.boundingBox;
  return {
    spacing: e2.spacing,
    hierarchyStepSize: e2.hierarchyStepSize,
    scale: [
      t2,
      t2,
      t2
    ],
    boundingBox: {
      min: [
        n2.lx,
        n2.ly,
        n2.lz
      ],
      max: [
        n2.ux,
        n2.uy,
        n2.uz
      ]
    },
    attributes: e2.pointAttributes.map((e3) => _s[e3])
  };
}
function ys(e2, t2, n2) {
  let r2 = new DataView(e2), i3 = [t2], a3 = 0;
  for (let t3 = 0; a3 + 5 <= e2.byteLength; t3++, a3 += 5) {
    let e3 = r2.getUint8(a3), o3 = r2.getUint32(a3 + 1, true), s3 = i3[t3];
    n2.set(s3, {
      childMask: e3,
      numPoints: o3
    });
    for (let t4 = 0; t4 < 8; t4++) e3 & 1 << t4 && i3.push(s3 + t4);
  }
}
function bs(e2, t2) {
  for (let n2 = 0, r2 = e2.length; n2 < r2; n2++) {
    let [r3, i3] = e2[n2];
    t2.set(r3, {
      childMask: 0,
      numPoints: i3
    });
  }
  t2.forEach((e3, n2) => {
    if (n2.length > 1) {
      let e4 = t2.get(n2.slice(0, -1));
      e4.childMask |= 1 << parseInt(n2.charAt(n2.length - 1));
    }
  });
}
function xs(e2, t2, n2, r2, i3) {
  let a3 = new DataView(e2, n2, r2), o3 = [t2], s3 = 0;
  for (let t3 = 0; s3 + 22 <= r2; t3++, s3 += 22) {
    let n3 = a3.getUint8(s3), r3 = a3.getUint8(s3 + 1), c3 = a3.getUint32(s3 + 2, true), l3 = a3.getBigInt64(s3 + 6, true), u4 = a3.getBigInt64(s3 + 14, true), d5 = o3[t3];
    if (n3 === 2 && t3 !== 0) {
      xs(e2, d5, Number(l3), Number(u4), i3);
      continue;
    }
    u4 === 0n && (c3 = 0), i3.set(d5, {
      childMask: r3,
      numPoints: c3,
      byteOffset: l3,
      byteSize: u4
    });
    for (let e3 = 0; e3 < 8; e3++) r3 & 1 << e3 && o3.push(d5 + e3);
  }
}
function Ss(e2, t2, n2) {
  let r2 = (e2[0] + t2[0]) / 2, i3 = (e2[1] + t2[1]) / 2, a3 = (e2[2] + t2[2]) / 2;
  return [[
    n2 & 4 ? r2 : e2[0],
    n2 & 2 ? i3 : e2[1],
    n2 & 1 ? a3 : e2[2]
  ], [
    n2 & 4 ? t2[0] : r2,
    n2 & 2 ? t2[1] : i3,
    n2 & 1 ? t2[2] : a3
  ]];
}
var Cs = class {
  constructor() {
    this.fetchOptions = {}, this.version = null, this.metadata = null, this.hierarchy = null, this._dataDirUrl = null, this._octreeUrl = null, this._loadedChunks = null, this._inlineHierarchy = false;
  }
  fetchData(e2, t2) {
    return fetch(e2, t2);
  }
  async load(e2) {
    let t2 = e2.split("/").pop(), n2 = e2.slice(0, e2.lastIndexOf("/") + 1), r2 = t2 === "metadata.json" ? 2 : 1, i3 = await this.fetchData(e2, this.fetchOptions);
    if (!i3.ok) throw Error(`PotreeLoader: Could not fetch "${e2}" with status ${i3.status}`);
    let a3 = await i3.json();
    this.version = r2, this.metadata = r2 === 2 ? a3 : vs(a3), this.hierarchy = /* @__PURE__ */ new Map(), r2 === 2 ? (this._octreeUrl = new URL("octree.bin", n2).href, xs(await (await this.fetchData(new URL("hierarchy.bin", n2).href, this.fetchOptions)).arrayBuffer(), "r", 0, a3.hierarchy.firstChunkSize, this.hierarchy)) : (this._dataDirUrl = new URL(a3.octreeDir + "/", n2).href, this._inlineHierarchy = !!a3.hierarchy, this._inlineHierarchy ? bs(a3.hierarchy, this.hierarchy) : (ys(await (await this.fetchData(new URL("r/r.hrc", this._dataDirUrl).href, this.fetchOptions)).arrayBuffer(), "r", this.hierarchy), this._loadedChunks = /* @__PURE__ */ new Set(["r"])));
  }
  async loadNodeData(e2, t2 = {}) {
    let n2 = this.hierarchy.get(e2), r2 = {
      ...this.fetchOptions,
      ...t2
    };
    if (this.version === 2) {
      if (n2.byteSize === 0n) return /* @__PURE__ */ new ArrayBuffer(0);
      let e3 = n2.byteOffset, t3 = n2.byteOffset + n2.byteSize - 1n;
      return (await this.fetchData(this._octreeUrl, {
        ...r2,
        headers: {
          ...r2.headers,
          Range: `bytes=${e3}-${t3}`
        }
      })).arrayBuffer();
    } else if (this._inlineHierarchy) return (await this.fetchData(`${this._dataDirUrl}${e2}.bin`, r2)).arrayBuffer();
    else {
      let { hierarchyStepSize: t3 } = this.metadata, n3 = e2.length - 1, i3 = gs(e2, t3);
      return n3 % t3 === 0 && !this._loadedChunks.has(e2) && (this._loadedChunks.add(e2), ys(await (await this.fetchData(`${this._dataDirUrl}${i3}/${e2}.hrc`, r2)).arrayBuffer(), e2, this.hierarchy)), (await this.fetchData(`${this._dataDirUrl}${i3}/${e2}.bin`, r2)).arrayBuffer();
    }
  }
  parsePointData(e2, t2, n2, r2) {
    let { attributes: i3, scale: a3, offset: o3 } = this.metadata, s3 = 0, c3 = i3.map((e3) => {
      let t3 = s3;
      return s3 += e3.size, t3;
    }), l3 = Math.floor(e2.byteLength / s3), u4 = new L4((n2[0] + r2[0]) / 2, (n2[1] + r2[1]) / 2, (n2[2] + r2[2]) / 2), d5 = i3.findIndex((e3) => e3.name === "position"), f4 = i3.findIndex((e3) => e3.name === "rgb" || e3.name === "rgba"), p4 = i3.findIndex((e3) => e3.name === "intensity"), m4 = new Float32Array(l3 * 3), h5 = f4 === -1 ? null : new Float32Array(l3 * 3), g5 = p4 === -1 ? null : new Float32Array(l3), _6 = new DataView(e2), v6 = this.version === 1 ? n2 : o3;
    for (let e3 = 0; e3 < l3; e3++) {
      let t3 = e3 * s3, n3 = t3 + c3[d5];
      if (m4[e3 * 3] = _6.getInt32(n3, true) * a3[0] + v6[0] - u4.x, m4[e3 * 3 + 1] = _6.getInt32(n3 + 4, true) * a3[1] + v6[1] - u4.y, m4[e3 * 3 + 2] = _6.getInt32(n3 + 8, true) * a3[2] + v6[2] - u4.z, f4 !== -1) {
        let n4 = i3[f4], r3 = t3 + c3[f4];
        n4.type === "uint16" ? (hs.setRGB(_6.getUint16(r3, true) / 65535, _6.getUint16(r3 + 2, true) / 65535, _6.getUint16(r3 + 4, true) / 65535, Ce2), hs.toArray(h5, e3 * 3)) : (hs.setRGB(_6.getUint8(r3) / 255, _6.getUint8(r3 + 1) / 255, _6.getUint8(r3 + 2) / 255, Ce2), hs.toArray(h5, e3 * 3));
      }
      if (p4 !== -1) {
        let n4 = t3 + c3[p4];
        g5[e3] = _6.getUint16(n4, true) / 65535;
      }
    }
    let y6 = new S4();
    return y6.setAttribute("position", new x5(m4, 3)), h5 && y6.setAttribute("color", new x5(h5, 3)), g5 && y6.setAttribute("intensity", new x5(g5, 1)), {
      geometry: y6,
      center: u4
    };
  }
};
var ws = class extends he2 {
  get isPointCloudMaterial() {
    return true;
  }
  get activeNodes() {
    return this.uniforms.uActiveNodes.value;
  }
  set activeNodes(e2) {
    let t2 = this.uniforms.uActiveNodes.value !== null;
    this.uniforms.uActiveNodes.value = e2, t2 !== (e2 !== null) && this._updateDefines();
  }
  get pointShape() {
    return this._pointShape;
  }
  set pointShape(e2) {
    e2 !== this._pointShape && (this._pointShape = e2, this._updateDefines());
  }
  get minPointSize() {
    return this.uniforms.uMinPointSize.value;
  }
  set minPointSize(e2) {
    this.uniforms.uMinPointSize.value = e2;
  }
  get edlStrength() {
    return this.uniforms.uEdlStrength.value;
  }
  set edlStrength(e2) {
    let t2 = this.uniforms.uEdlStrength.value > 0;
    this.uniforms.uEdlStrength.value = e2, t2 !== e2 > 0 && this._updateDefines();
  }
  get edlRadius() {
    return this.uniforms.uEdlRadius.value;
  }
  set edlRadius(e2) {
    this.uniforms.uEdlRadius.value = e2;
  }
  get debugColorMode() {
    return this._debugColorMode;
  }
  set debugColorMode(e2) {
    e2 !== this._debugColorMode && (this._debugColorMode = e2, this._updateDefines());
  }
  constructor(e2 = {}) {
    let { pointShape: t2 = "round", minPointSize: n2 = 2, debugColorMode: r2 = "none", edlStrength: i3 = 0, edlRadius: a3 = 1.4, ...o3 } = e2;
    super(o3), this._pointShape = t2, this._debugColorMode = r2, this.defines = {}, this.uniforms = {
      uActiveNodes: { value: null },
      uNodeSize: { value: 1 },
      uNodeMinOffset: { value: new L4() },
      uMinPointSize: { value: n2 },
      uTileId: { value: 0 },
      uEdlTexture: { value: null },
      uEdlResolution: { value: new I4(1, 1) },
      uEdlStrength: { value: i3 },
      uEdlRadius: { value: a3 },
      uEdlDepthPass: { value: false }
    }, this._updateDefines(), this.onBeforeCompile = (e3) => {
      Object.assign(e3.uniforms, this.uniforms), e3.vertexShader = e3.vertexShader.replace("uniform float size;", `
						uniform float size;
						uniform float uMinPointSize;

						varying vec3 vViewPosition;
						varying float vRadius;
						varying float vNodeId;
						varying float vDepth;
						varying float vLogDepth;

						#ifdef LOD_SIZING

						uniform usampler2D uActiveNodes;
						uniform float uNodeSize;
						uniform vec3 uNodeMinOffset;

						// number of set bits below the given bit index
						uint numberOfOnes( uint mask, int index ) {

							uint bitsBelow = mask & ( ( 1u << uint( index ) ) - 1u );
							uint count = 0u;
							for ( int i = 0; i < 8; i ++ ) {

								count += ( bitsBelow >> uint( i ) ) & 1u;

							}

							return count;

						}

						// Walks the hierarchy texture, returning the deepest active depth (x), an id
						// for that node (y) and its lod offset (z). The id comes from the octant
						// path so it stays stable as the texture is re-encoded. Adapted from
						// "getLOD" in potree's pointcloud.vs.
						vec3 getActiveDepth( vec3 posInNode ) {

							int textureWidth = textureSize( uActiveNodes, 0 ).x;
							vec3 offset = vec3( 0.0 );
							int nodeIndex = 0;
							uint nodePath = 0u;
							float lodOffset = 0.0;
							int depth = 0;
							for ( ; depth < 20; depth ++ ) {

								uvec4 value = texelFetch( uActiveNodes, ivec2( nodeIndex % textureWidth, nodeIndex / textureWidth ), 0 );

								// octant of the current node containing the point
								float nodeSize = uNodeSize / pow( 2.0, float( depth ) );
								vec3 index3d = floor( ( posInNode - offset ) / nodeSize + 0.5 );
								int octant = int( 4.0 * index3d.x + 2.0 * index3d.y + index3d.z );
								uint octantMask = 1u << uint( octant );

								// stop when the octant holds no active child
								uint childMask = value.r;
								if ( ( childMask & octantMask ) == 0u ) {

									lodOffset = float( value.a ) / 10.0 - 10.0;
									break;

								}

								// child texel: the first child offset plus the active siblings below it
								nodeIndex += int( value.g * 256u + value.b + numberOfOnes( childMask, octant ) );
								offset += nodeSize * 0.5 * index3d;

								// offset by one so trailing zeroes still change the id
								nodePath = nodePath * 8u + uint( octant ) + 1u;

							}

							// kept under 2^24 so the id survives the trip through a float varying
							return vec3( float( depth ), float( nodePath % 16777216u ), lodOffset );

						}

						#endif
					`).replace("#include <logdepthbuf_vertex>", `
						vec3 activeResult = vec3( 0.0 );
						#ifdef LOD_SIZING

							activeResult = getActiveDepth( position + uNodeMinOffset );

						#endif

						float worldSize = size / pow( 2.0, activeResult.x + activeResult.z );

						// three's "scale" omits the 1 / tan( fov / 2 ) term, so its attenuation is
						// not world scale. The projection y scale restores it, as potree does.
						// Orthographic projections have no distance falloff at all.
						float projFactor = scale * projectionMatrix[ 1 ][ 1 ];
						if ( isPerspectiveMatrix( projectionMatrix ) ) {

							projFactor /= - mvPosition.z;

						}

						gl_PointSize = worldSize * projFactor;
						gl_PointSize = max( gl_PointSize, uMinPointSize );

						vViewPosition = mvPosition.xyz;
						vNodeId = activeResult.y;
						vDepth = activeResult.x;

						// half the world size the sprite covers, including the pixel clamp
						vRadius = 0.5 * gl_PointSize / projFactor;
						vLogDepth = log2( - mvPosition.z );

						#include <logdepthbuf_vertex>
					`), e3.fragmentShader = e3.fragmentShader.replace("uniform float opacity;", `
					uniform float opacity;
					uniform mat4 projectionMatrix;
					uniform float uTileId;

					varying vec3 vViewPosition;
					varying float vRadius;
					varying float vNodeId;
					varying float vDepth;
					varying float vLogDepth;

					#ifdef EDL_ENABLED

						uniform sampler2D uEdlTexture;
						uniform vec2 uEdlResolution;
						uniform float uEdlStrength;
						uniform float uEdlRadius;
						uniform bool uEdlDepthPass;

						// Darken by how far this point sits behind a ring of neighbors in the
						// pre-pass target. Adapted from potree's "edl.fs".
						float edlShade( float logDepth ) {

							vec2 uv = gl_FragCoord.xy / uEdlResolution;
							vec2 uvRadius = uEdlRadius / uEdlResolution;

							float sum = 0.0;
							for ( int i = 0; i < 8; i ++ ) {

								float angle = 6.2831853 * float( i ) / 8.0;
								vec2 offset = uvRadius * vec2( cos( angle ), sin( angle ) );
								float neighborDepth = texture2D( uEdlTexture, uv + offset ).r;

								// zero means nothing was drawn there, so it contributes nothing
								if ( neighborDepth != 0.0 ) {

									sum += max( 0.0, logDepth - neighborDepth );

								}

							}

							return exp( - ( sum / 8.0 ) * 300.0 * uEdlStrength );

						}

					#endif

					// spread sequential ids into visually distinct colors
					vec3 idToColor( float id ) {

						return vec3(
							fract( sin( id * 12.9898 ) * 43758.5453 ),
							fract( sin( id * 78.2330 ) * 12543.2341 ),
							fract( sin( id * 3.7010 ) * 26445.3450 )
						);

					}
					`).replace("#include <color_fragment>", "\n					#include <color_fragment>\n\n					#ifdef DEBUG_NODE_COLORS\n\n						diffuseColor.rgb = idToColor( vNodeId + 1.0 );\n\n					#endif\n\n					// the tile the point came from, rather than the node it is sized by\n					#ifdef DEBUG_TILE_COLORS\n\n						diffuseColor.rgb = idToColor( uTileId + 1.0 );\n\n					#endif\n\n					// one hue per level\n					#ifdef DEBUG_DEPTH_COLORS\n\n						float hue = vDepth / 8.0;\n						diffuseColor.rgb = clamp( abs( fract( hue + vec3( 0.0, 2.0 / 3.0, 1.0 / 3.0 ) ) * 6.0 - 3.0 ) - 1.0, 0.0, 1.0 );\n\n					#endif\n					").replace("#include <colorspace_fragment>", "\n					#include <colorspace_fragment>\n\n					#ifdef EDL_ENABLED\n\n						// shade after the color space conversion so the falloff lands on the\n						// encoded color, as potree's post process does\n						gl_FragColor.rgb *= edlShade( vLogDepth );\n\n					#endif\n					").replace("#include <clipping_planes_fragment>", "\n					#include <clipping_planes_fragment>\n\n					#if defined( ROUND_POINTS ) || defined( SPHERE_POINTS )\n\n						vec2 pointOffset = gl_PointCoord * 2.0 - 1.0;\n\n					#endif\n\n					#ifdef ROUND_POINTS\n\n						// discard the sprite corners so points draw as circles\n						if ( dot( pointOffset, pointOffset ) > 1.0 ) discard;\n\n					#endif\n\n					#ifdef SPHERE_POINTS\n\n						// Intersect the view ray with the point's sphere and write that depth so\n						// overlapping points meet as solid spheres rather than flat discs. The\n						// fragment sits on the sprite plane, at the point's depth, so perspective\n						// rays run from the eye through it and orthographic rays run from it.\n						bool isPerspective = isPerspectiveMatrix( projectionMatrix );\n						vec3 spritePosition = vViewPosition + vec3( pointOffset * vRadius, 0.0 );\n						vec3 rayOrigin = isPerspective ? vec3( 0.0 ) : spritePosition;\n						vec3 rayDirection = isPerspective ? normalize( spritePosition ) : vec3( 0.0, 0.0, - 1.0 );\n\n						vec3 centerOffset = rayOrigin - vViewPosition;\n						float halfB = dot( centerOffset, rayDirection );\n						float disc = halfB * halfB - dot( centerOffset, centerOffset ) + vRadius * vRadius;\n						if ( disc < 0.0 ) discard;\n\n						vec3 hitPosition = rayOrigin + rayDirection * ( - halfB - sqrt( disc ) );\n						vec4 clipPosition = projectionMatrix * vec4( hitPosition, 1.0 );\n						gl_FragDepth = ( clipPosition.z / clipPosition.w ) * 0.5 + 0.5;\n\n					#endif\n\n					#ifdef EDL_ENABLED\n\n						// the pre-pass only needs the log depth, so return before the color work\n						if ( uEdlDepthPass ) {\n\n							gl_FragColor = vec4( vLogDepth, 0.0, 0.0, 1.0 );\n							return;\n\n						}\n\n					#endif\n					");
    };
  }
  _updateDefines() {
    let e2 = {};
    this.uniforms.uActiveNodes.value !== null && (e2.LOD_SIZING = ""), this.uniforms.uEdlStrength.value > 0 && (e2.EDL_ENABLED = ""), this._pointShape === "round" && (e2.ROUND_POINTS = ""), this._pointShape === "sphere" && (e2.SPHERE_POINTS = ""), this._debugColorMode === "node" && (e2.DEBUG_NODE_COLORS = ""), this._debugColorMode === "depth" && (e2.DEBUG_DEPTH_COLORS = ""), this._debugColorMode === "tile" && (e2.DEBUG_TILE_COLORS = ""), this.defines = e2, this.needsUpdate = true;
  }
};
var Ts = /* @__PURE__ */ new I4();
var Es = /* @__PURE__ */ new w4();
var Ds = class extends ce3 {
  constructor(e2) {
    let t2 = new S4();
    t2.setDrawRange(0, 0), super(t2, new F4({
      colorWrite: false,
      depthWrite: false
    })), this.frustumCulled = false, this.renderOrder = -Infinity, this.onBeforeRender = e2;
  }
  dispose() {
    this.geometry.dispose(), this.material.dispose();
  }
};
var Os = class {
  get pointShape() {
    return this._pointShape;
  }
  set pointShape(e2) {
    e2 !== this._pointShape && (this._pointShape = e2, this._updateMaterials());
  }
  get minPointSize() {
    return this._minPointSize;
  }
  set minPointSize(e2) {
    e2 !== this._minPointSize && (this._minPointSize = e2, this._updateMaterials());
  }
  get edlStrength() {
    return this._edlStrength;
  }
  set edlStrength(e2) {
    e2 !== this._edlStrength && (this._edlStrength = e2, this._updateMaterials());
  }
  get edlRadius() {
    return this._edlRadius;
  }
  set edlRadius(e2) {
    this._edlRadius = e2;
  }
  get debugColorMode() {
    return this._debugColorMode;
  }
  set debugColorMode(e2) {
    e2 !== this._debugColorMode && (this._debugColorMode = e2, this._updateMaterials());
  }
  constructor(e2 = {}) {
    let { pointShape: t2 = "round", minPointSize: n2 = 2, edlStrength: r2 = 0, edlRadius: i3 = 1.4, debugColorMode: a3 = "none" } = e2;
    this.name = "POINT_CLOUD_EFFECTS_PLUGIN", this.tiles = null, this._pointShape = t2, this._minPointSize = n2, this._debugColorMode = a3, this._edlStrength = r2, this._edlRadius = i3, this._edlTarget = new Pe2(1, 1, {
      format: Se2,
      type: j4,
      minFilter: de3,
      magFilter: de3
    }), this._edlGroup = new te3(), this._edlGroup.matrixWorldAutoUpdate = false, this._edlHook = new Ds((e3, t3, n3) => this._renderDepthPass(e3, n3));
  }
  init(e2) {
    this.tiles = e2, e2.group.add(this._edlHook);
  }
  dispose() {
    this._edlHook.removeFromParent(), this._edlHook.dispose(), this._edlTarget.dispose(), this.tiles = null;
  }
  processTileModel(e2) {
    e2.traverse((e3) => {
      if (e3.isPoints) {
        if (!e3.material.isPointCloudMaterial) {
          let t2 = e3.material;
          e3.material = new ws({
            color: t2.color,
            vertexColors: t2.vertexColors,
            size: t2.size,
            map: t2.map,
            transparent: t2.transparent,
            opacity: t2.opacity
          }), t2.dispose();
        }
        this._applyToMaterial(e3.material);
      }
    });
  }
  _renderDepthPass(e2, t2) {
    if (this.edlStrength <= 0) return;
    let n2 = this._edlTarget;
    e2.getDrawingBufferSize(Ts), (n2.width !== Ts.x || n2.height !== Ts.y) && n2.setSize(Ts.x, Ts.y);
    let r2 = this._edlGroup.children;
    r2.length = 0, this.tiles.group.traverseVisible((e3) => {
      if (!e3.isPoints || !e3.material.isPointCloudMaterial) return;
      r2.push(e3);
      let { uniforms: t3 } = e3.material;
      t3.uEdlTexture.value = null, t3.uEdlDepthPass.value = true;
    });
    let i3 = e2.getRenderTarget(), a3 = e2.getClearAlpha();
    e2.getClearColor(Es), e2.setRenderTarget(n2), e2.setClearColor(0, 0), e2.clear(), e2.render(this._edlGroup, t2), e2.setRenderTarget(i3), e2.setClearColor(Es, a3), r2.forEach((t3) => {
      let { uniforms: r3 } = t3.material;
      r3.uEdlTexture.value = n2.texture, r3.uEdlResolution.value.set(n2.width, n2.height), r3.uEdlRadius.value = this.edlRadius * e2.getPixelRatio(), r3.uEdlDepthPass.value = false;
    }), r2.length = 0;
  }
  _applyToMaterial(e2) {
    e2.pointShape = this.pointShape, e2.minPointSize = this.minPointSize, e2.debugColorMode = this.debugColorMode, e2.edlStrength = this.edlStrength;
  }
  _updateMaterials() {
    this.tiles && this.tiles.forEachLoadedModel((e2) => {
      e2.traverse((e3) => {
        e3.material && e3.material.isPointCloudMaterial && this._applyToMaterial(e3.material);
      });
    });
  }
};
var ks = 1.7;
function As(e2) {
  return e2.split("/").pop().replace(/\.potree$/, "");
}
function js(e2) {
  let t2 = 0;
  for (let n2 = 1, r2 = e2.length; n2 < r2; n2++) t2 = (t2 * 8 + parseInt(e2[n2]) + 1) % 16777216;
  return t2;
}
function Ms(e2, t2) {
  return [
    (e2[0] + t2[0]) / 2,
    (e2[1] + t2[1]) / 2,
    (e2[2] + t2[2]) / 2,
    (t2[0] - e2[0]) / 2,
    0,
    0,
    0,
    (t2[1] - e2[1]) / 2,
    0,
    0,
    0,
    (t2[2] - e2[2]) / 2
  ];
}
function Ns(e2) {
  let t2 = new E4(new Uint8Array(e2 * e2 * 4), e2, e2, ve2, je2);
  return t2.internalFormat = "RGBA8UI", t2.minFilter = de3, t2.magFilter = de3, t2;
}
function Ps(e2) {
  let [t2, n2, r2, i3, , , , a3, , , , o3] = e2;
  return [[
    t2 - i3,
    n2 - a3,
    r2 - o3
  ], [
    t2 + i3,
    n2 + a3,
    r2 + o3
  ]];
}
var Fs = class extends Os {
  get pointScale() {
    return this._pointScale;
  }
  set pointScale(e2) {
    e2 !== this._pointScale && (this._pointScale = e2, this._updateMaterials());
  }
  constructor(e2 = {}) {
    super(e2);
    let { url: t2 = null, pointScale: n2 = 1, useRecommendedSettings: r2 = true } = e2;
    this.name = "POTREE_PLUGIN", this.priority = -1e3, this.url = t2, this.loader = null, this.useRecommendedSettings = r2, this._pointScale = n2, this._activeNodesTexture = Ns(1), this._activeSetDirty = false, this._onUpdateAfter = () => {
      this._activeSetDirty && (this._activeSetDirty = false, this._updateActiveNodesTexture());
    };
  }
  init(e2) {
    super.init(e2), this.useRecommendedSettings && (e2.errorTarget = 1);
    let t2 = new Cs();
    t2.fetchOptions = e2.fetchOptions, t2.fetchData = (t3, n2) => e2.invokeOnePlugin((e3) => e3.fetchData && e3.fetchData(t3, n2)), this.loader = t2, e2.addEventListener("update-after", this._onUpdateAfter);
  }
  dispose() {
    this.tiles.removeEventListener("update-after", this._onUpdateAfter), this._activeNodesTexture.dispose(), super.dispose(), this.loader = null;
  }
  setTileActive() {
    this._activeSetDirty = true;
  }
  async loadRootTileset() {
    let { tiles: e2, url: t2, loader: n2 } = this, r2 = new URL(t2 ?? e2.rootURL, location.href).href;
    e2.invokeAllPlugins((e3) => {
      r2 = e3.preprocessURL ? e3.preprocessURL(r2, null) : r2;
    }), await n2.load(r2);
    let { spacing: i3, boundingBox: a3 } = n2.metadata, o3 = {
      asset: { version: "1.1" },
      geometricError: Infinity,
      root: {
        refine: "ADD",
        geometricError: i3,
        boundingVolume: { box: Ms(a3.min, a3.max) },
        content: { uri: "r.potree" },
        children: []
      }
    };
    return e2.preprocessTileset(o3, r2.slice(0, r2.lastIndexOf("/") + 1)), o3;
  }
  fetchData(e2, t2) {
    return /\.potree$/.test(e2) ? this.loader.loadNodeData(As(e2), t2) : null;
  }
  parseToMesh(e2, t2, n2, r2) {
    if (n2 !== "potree") return null;
    let i3 = As(r2), [a3, o3] = Ps(t2.boundingVolume.box), { geometry: s3, center: c3 } = this.loader.parsePointData(e2, i3, a3, o3), { spacing: l3, boundingBox: u4 } = this.loader.metadata, d5 = new ws({
      vertexColors: !!s3.attributes.color,
      size: l3 * ks * this.pointScale
    });
    d5.activeNodes = this._activeNodesTexture, d5.uniforms.uTileId.value = js(i3), d5.uniforms.uNodeSize.value = u4.max[0] - u4.min[0], d5.uniforms.uNodeMinOffset.value.copy(c3).sub(new L4(...u4.min));
    let f4 = new me2(s3, d5);
    return f4.position.copy(c3), f4.updateMatrix(), this._expandChildren(t2, i3), this._activeSetDirty = true, f4;
  }
  disposeTile(e2) {
    let { processNodeQueue: t2 } = this.tiles;
    for (let n2 = 0, r2 = e2.children.length; n2 < r2; n2++) t2.remove(e2.children[n2]);
    e2.children.length = 0, this._activeSetDirty = true;
  }
  _expandChildren(e2, t2) {
    let { loader: n2 } = this, r2 = n2.hierarchy.get(t2), [i3, a3] = Ps(e2.boundingVolume.box), o3 = e2.geometricError / 2;
    for (let n3 = 0; n3 < 8; n3++) {
      let s3 = t2 + n3;
      if (!(r2.childMask & 1 << n3)) continue;
      let [c3, l3] = Ss(i3, a3, n3);
      e2.children.push({
        refine: "ADD",
        geometricError: o3,
        boundingVolume: { box: Ms(c3, l3) },
        content: { uri: `${s3}.potree` },
        children: []
      });
    }
  }
  _updateActiveNodesTexture() {
    let { tiles: e2 } = this, t2 = /* @__PURE__ */ new Map();
    e2.activeTiles.forEach((e3) => {
      t2.set(e3, As(e3.content.uri));
    });
    let n2 = [...t2.keys()].sort((e3, n3) => {
      let r3 = t2.get(e3), i4 = t2.get(n3);
      return r3.length === i4.length ? r3 < i4 ? -1 : 1 : r3.length - i4.length;
    }), r2 = this._activeNodesTexture, i3 = Math.ceil(Math.sqrt(n2.length));
    i3 > r2.image.width && (r2.dispose(), r2 = Ns(i3), this._activeNodesTexture = r2, e2.forEachLoadedModel((e3) => {
      e3.material.activeNodes = r2;
    }));
    let a3 = r2.image.data;
    a3.fill(0);
    let o3 = /* @__PURE__ */ new Map();
    for (let e3 = 0, r3 = n2.length; e3 < r3; e3++) {
      let r4 = t2.get(n2[e3]);
      if (o3.set(r4, e3), a3[e3 * 4 + 3] = 100, e3 === 0) continue;
      let i4 = r4.slice(0, -1), s3 = o3.get(i4);
      if (a3[s3 * 4] === 0) {
        let t3 = e3 - s3;
        a3[s3 * 4 + 1] = t3 >> 8, a3[s3 * 4 + 2] = t3 & 255;
      }
      let c3 = parseInt(r4.charAt(r4.length - 1));
      a3[s3 * 4] |= 1 << c3;
    }
    r2.needsUpdate = true;
  }
  _updateMaterials() {
    super._updateMaterials();
    let { metadata: e2 } = this.loader ?? {};
    e2 && this.tiles.forEachLoadedModel((t2) => {
      t2.material.size = e2.spacing * ks * this.pointScale;
    });
  }
};
var Is = class extends S4 {
  constructor(e2 = 1, t2 = 1, n2 = 1, r2 = 1) {
    super();
    let i3 = n2 + 1, a3 = r2 + 1, o3 = i3 * a3, s3 = [];
    for (let e3 = 0; e3 < i3; e3++) s3.push(e3);
    for (let e3 = 1; e3 < a3; e3++) s3.push(e3 * i3 + i3 - 1);
    for (let e3 = i3 - 2; e3 >= 0; e3--) s3.push((a3 - 1) * i3 + e3);
    for (let e3 = a3 - 2; e3 >= 1; e3--) s3.push(e3 * i3);
    let c3 = s3.length, l3 = o3 + c3, u4 = new Float32Array(3 * l3), d5 = new Float32Array(3 * l3), f4 = new Float32Array(2 * l3);
    for (let o4 = 0; o4 < a3; o4++) for (let a4 = 0; a4 < i3; a4++) {
      let s4 = o4 * i3 + a4, c4 = a4 / n2, l4 = 1 - o4 / r2;
      u4[3 * s4 + 0] = (c4 - 0.5) * e2, u4[3 * s4 + 1] = (l4 - 0.5) * t2, d5[3 * s4 + 2] = 1, f4[2 * s4 + 0] = c4, f4[2 * s4 + 1] = l4;
    }
    for (let e3 = 0; e3 < c3; e3++) {
      let t3 = s3[e3], n3 = o3 + e3;
      u4[3 * n3 + 0] = u4[3 * t3 + 0], u4[3 * n3 + 1] = u4[3 * t3 + 1], u4[3 * n3 + 2] = u4[3 * t3 + 2], d5[3 * n3 + 2] = 1, f4[2 * n3 + 0] = f4[2 * t3 + 0], f4[2 * n3 + 1] = f4[2 * t3 + 1];
    }
    let p4 = new Uint32Array(6 * n2 * r2 + 6 * c3), m4 = 0;
    for (let e3 = 0; e3 < r2; e3++) for (let t3 = 0; t3 < n2; t3++) {
      let n3 = e3 * i3 + t3, r3 = (e3 + 1) * i3 + t3, a4 = (e3 + 1) * i3 + t3 + 1, o4 = e3 * i3 + t3 + 1;
      p4[m4++] = n3, p4[m4++] = r3, p4[m4++] = o4, p4[m4++] = r3, p4[m4++] = a4, p4[m4++] = o4;
    }
    for (let e3 = 0; e3 < c3; e3++) {
      let t3 = (e3 + 1) % c3, n3 = s3[e3], r3 = s3[t3], i4 = o3 + e3, a4 = o3 + t3;
      p4[m4++] = n3, p4[m4++] = r3, p4[m4++] = i4, p4[m4++] = r3, p4[m4++] = a4, p4[m4++] = i4;
    }
    this.setIndex(new x5(p4, 1)), this.setAttribute("position", new x5(u4, 3)), this.setAttribute("normal", new x5(d5, 3)), this.setAttribute("uv", new x5(f4, 2)), this.surfaceVertexCount = o3, this.skirtSourceIndices = new Uint32Array(s3);
  }
};
function Ls(e2, t2, n2) {
  let { width: r2, height: i3 } = e2;
  t2.width = r2, t2.height = i3;
  let a3 = t2.getContext("2d", { willReadFrequently: true });
  a3.drawImage(e2, 0, 0);
  let { data: o3 } = a3.getImageData(0, 0, r2, i3);
  a3.clearRect(0, 0, r2, i3);
  let s3 = r2 + 2, c3 = i3 + 2, l3 = new Float32Array(s3 * c3);
  for (let e3 = 0; e3 < i3; e3++) for (let t3 = 0; t3 < r2; t3++) {
    let i4 = 4 * (e3 * r2 + t3);
    l3[(e3 + 1) * s3 + t3 + 1] = n2(o3[i4], o3[i4 + 1], o3[i4 + 2]);
  }
  for (let e3 = 0; e3 < s3; e3++) {
    let t3 = N4.clamp(e3, 1, s3 - 2);
    l3[e3] = l3[s3 + t3], l3[(c3 - 1) * s3 + e3] = l3[(c3 - 2) * s3 + t3];
  }
  for (let e3 = 1; e3 < c3 - 1; e3++) l3[e3 * s3] = l3[e3 * s3 + 1], l3[e3 * s3 + s3 - 1] = l3[e3 * s3 + s3 - 2];
  let u4 = new E4(l3, s3, c3, Se2, j4);
  return u4.minFilter = ie4, u4.magFilter = ie4, u4.needsUpdate = true, u4;
}
function Rs(e2, t2, n2, r2) {
  let { data: i3, width: a3, height: o3 } = e2.image, s3 = t2.image.data, c3 = a3 - 2, l3 = o3 - 2, u4 = 1, d5 = a3 - 2;
  n2 === -1 ? (u4 = 0, d5 = 0) : n2 === 1 && (u4 = a3 - 1, d5 = a3 - 1);
  let f4 = 1, p4 = o3 - 2;
  r2 === -1 ? (f4 = 0, p4 = 0) : r2 === 1 && (f4 = o3 - 1, p4 = o3 - 1);
  for (let e3 = f4; e3 <= p4; e3++) for (let t3 = u4; t3 <= d5; t3++) i3[e3 * a3 + t3] = s3[(e3 - r2 * l3) * a3 + (t3 - n2 * c3)];
  e2.needsUpdate = true;
}
var zs = class extends xt2 {
  constructor(e2) {
    super(), this.plugin = e2, this.canvas = new OffscreenCanvas(1, 1);
  }
  async fetchItem([e2, t2, n2], r2) {
    let { plugin: i3 } = this, a3 = await i3._source.fetchItem([
      e2,
      t2,
      n2
    ], r2), o3 = Ls(a3.image, this.canvas, (e3, t3, n3) => i3.decodeElevation(e3, t3, n3));
    return i3._source.disposeItem(a3), this.stitchNeighbors(o3, e2, t2, n2), o3;
  }
  disposeItem(e2) {
    e2 && e2.dispose();
  }
  stitchNeighbors(e2, t2, n2, r2) {
    let i3 = this.plugin._source.tiling, { tileCountX: a3 } = i3.getLevel(r2), o3 = i3.flipY ? -1 : 1;
    for (let i4 = -1; i4 <= 1; i4++) for (let s3 = -1; s3 <= 1; s3++) {
      if (i4 === 0 && s3 === 0) continue;
      let c3 = (t2 + i4 + a3) % a3, l3 = n2 + s3 * o3, u4 = this.get(c3, l3, r2);
      u4 && !(u4 instanceof Promise) && (Rs(e2, u4, i4, s3), Rs(u4, e2, -i4, -s3));
    }
  }
};
var Bs = class extends le3 {
  constructor(e2) {
    super(e2), this.onBeforeCompile = (e3) => {
      e3.fragmentShader = e3.fragmentShader.replace("#include <bumpmap_pars_fragment>", "\n				#ifdef USE_BUMPMAP\n\n					uniform sampler2D bumpMap;\n					uniform float bumpScale;\n\n					// relative determinant threshold below which the geometry is considered edge-on\n					const float DEGENERATE_DET_EPSILON = 1e-3;\n\n					// central differences at one texel spacing so the gradient interpolates across texels\n					vec2 dHdxy_fwd() {\n\n						vec2 dSTdx = dFdx( vBumpMapUv );\n						vec2 dSTdy = dFdy( vBumpMapUv );\n\n						vec2 texelSize = 1.0 / vec2( textureSize( bumpMap, 0 ) );\n						vec2 dx = vec2( texelSize.x, 0.0 );\n						vec2 dy = vec2( 0.0, texelSize.y );\n						float gradU = ( texture2D( bumpMap, vBumpMapUv + dx ).x - texture2D( bumpMap, vBumpMapUv - dx ).x ) / ( 2.0 * texelSize.x );\n						float gradV = ( texture2D( bumpMap, vBumpMapUv + dy ).x - texture2D( bumpMap, vBumpMapUv - dy ).x ) / ( 2.0 * texelSize.y );\n\n						float dBx = bumpScale * ( gradU * dSTdx.x + gradV * dSTdx.y );\n						float dBy = bumpScale * ( gradU * dSTdy.x + gradV * dSTdy.y );\n\n						return vec2( dBx, dBy );\n\n					}\n\n					// unnormalized surface derivatives so the gradient resolves to the physical slope\n					vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {\n\n						vec3 vSigmaX = dFdx( surf_pos.xyz );\n						vec3 vSigmaY = dFdy( surf_pos.xyz );\n						vec3 vN = surf_norm; // normalized\n\n						vec3 R1 = cross( vSigmaY, vN );\n						vec3 R2 = cross( vN, vSigmaX );\n\n						float fDet = dot( vSigmaX, R1 ) * faceDirection;\n\n						// Edge-on geometry, such as the tile skirts, has a degenerate determinant that\n						// amplifies the gradient into a garbage normal, so fall back to the surface normal.\n						if ( abs( fDet ) < DEGENERATE_DET_EPSILON * length( vSigmaX ) * length( vSigmaY ) ) {\n\n							return surf_norm;\n\n						}\n\n						vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );\n						return normalize( abs( fDet ) * surf_norm - vGrad );\n\n					}\n\n				#endif\n			");
    };
  }
};
var Vs = class extends F4 {
  constructor(e2) {
    super(e2), this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.onBeforeCompile = (e3) => {
      e3.uniforms.displacementMap = { value: null }, e3.uniforms.displacementScale = { value: 1 }, e3.uniforms.displacementBias = { value: 0 }, e3.uniforms.displacementMapTransform = { value: new se3() }, e3.vertexShader = e3.vertexShader.replace("#include <uv_pars_vertex>", "\n					#include <uv_pars_vertex>\n					uniform sampler2D displacementMap;\n					uniform float displacementScale;\n					uniform float displacementBias;\n				").replace("#include <begin_vertex>", "\n					#include <begin_vertex>\n					transformed += normalize( normal ) * ( texture2D( displacementMap, uv ).x * displacementScale + displacementBias );\n				");
    };
  }
};
var Hs = Symbol("TILE_X");
var Us = Symbol("TILE_Y");
var Ws = Symbol("TILE_LEVEL");
var Gs = Symbol("HEIGHT_GRID");
var Ks = Symbol("SOURCE_TILE");
var qs = Symbol("OVERLAY_RANGE");
var Js = Symbol("OVERLAY_LEVEL");
var Ys = Symbol("HEIGHT_RANGE");
var Xs = 32;
var Zs = -500;
var Qs = 9e3;
var $s = 2;
var Q4 = /* @__PURE__ */ new L4();
var $4 = /* @__PURE__ */ new L4();
var ec2 = /* @__PURE__ */ new Ee2();
var tc = [];
var nc = [0, 0];
var rc = null;
function ic() {
  return rc === null && (rc = new ce3(new Is(1, 1, Xs, Xs), new F4()), rc.matrixAutoUpdate = false), rc;
}
function ac(e2, t2) {
  return Math.min($s * Math.floor(e2 / $s), t2);
}
function oc(e2, t2) {
  let { width: n2, height: r2 } = e2.image, i3 = n2 - 2, a3 = r2 - 2;
  return [
    (t2[0] * i3 + 1) / n2,
    (t2[1] * a3 + 1) / r2,
    (t2[2] * i3 + 1) / n2,
    (t2[3] * a3 + 1) / r2
  ];
}
function sc(e2, t2, n2) {
  let { data: r2, width: i3, height: a3 } = e2.image, o3 = N4.clamp(t2 * i3 - 0.5, 0, i3 - 1), s3 = N4.clamp(n2 * a3 - 0.5, 0, a3 - 1), c3 = Math.floor(o3), l3 = Math.floor(s3), u4 = Math.min(c3 + 1, i3 - 1), d5 = Math.min(l3 + 1, a3 - 1), f4 = o3 - c3, p4 = s3 - l3, m4 = r2[l3 * i3 + c3] * (1 - f4) + r2[l3 * i3 + u4] * f4, h5 = r2[d5 * i3 + c3] * (1 - f4) + r2[d5 * i3 + u4] * f4;
  return m4 * (1 - p4) + h5 * p4;
}
var cc = class {
  get shape() {
    return console.warn('TerrainRGBMeshPlugin: "shape" is deprecated. Use "projection" instead.'), this.projection === "ellipsoid" ? "ellipsoid" : "planar";
  }
  set shape(e2) {
    console.warn('TerrainRGBMeshPlugin: "shape" is deprecated. Use "projection" instead.'), this.projection = e2 === "planar" ? "source" : "ellipsoid";
  }
  get heightScale() {
    return this._heightScale;
  }
  set heightScale(e2) {
    e2 !== this._heightScale && (this._heightScale = e2, this._updateHeightScale());
  }
  constructor(e2 = {}) {
    let { url: t2 = null, tileDimension: n2 = 256, maxZoom: r2 = 15, heightScale: i3 = 1, overlay: a3 = null, applyOverlayTexture: o3 = false, unlit: s3 = false, shape: c3 = null, projection: l3 = null, endCaps: u4 = true, useRecommendedSettings: d5 = true } = e2;
    this.name = "TERRAIN_RGB_MESH_PLUGIN", this.priority = -10, this.tiles = null, this.url = t2, this.tileDimension = n2, this.maxZoom = r2, this.overlay = a3, this.applyOverlayTexture = o3, this.unlit = s3, this.projection = l3 ?? "ellipsoid", c3 !== null && (console.warn('TerrainRGBMeshPlugin: "shape" is deprecated. Use "projection" instead.'), l3 === null && (this.projection = c3 === "planar" ? "source" : "ellipsoid")), this.endCaps = u4, this.useRecommendedSettings = d5, this.heightScale = i3, this._source = null, this._gridCache = new zs(this), this._tiling = null, this._maxSourceLevel = -1;
  }
  init(e2) {
    this.useRecommendedSettings && (e2.errorTarget = 1), this.tiles = e2;
  }
  async loadRootTileset() {
    this.overlay && await this.overlay.init();
    let { url: e2, tileDimension: t2, maxZoom: n2, overlay: r2, applyOverlayTexture: i3 } = this;
    this._maxSourceLevel = $s * Math.floor(n2 / $s);
    let a3 = this._maxSourceLevel + $s - 1;
    r2 && i3 && (a3 = Math.max(a3, r2.tiling.maxLevel)), this._source = new Ct2({
      url: e2,
      tileDimension: t2,
      levels: a3 + 1
    }), this._source.fetchData = (e3, t3) => {
      let n3 = { priority: -performance.now() };
      return this.tiles.downloadQueue.add(e3, n3, () => fetch(e3, t3), t3.signal);
    }, await this._source.init(), this._tiling = this._source.tiling;
    let { projection: o3 } = this, s3 = o3 === "ellipsoid" || o3 === "source" ? this._tiling.projection : new R5(o3), [c3, l3] = s3.getProjectedExtents(), u4 = c3 / l3;
    if (this.projection !== "ellipsoid") {
      let e3 = new ot2(s3);
      e3.scale.set(u4, 1), e3.offset.set(-u4 / 2, -0.5), this.tiles.surface = e3;
    }
    return this.getTileset();
  }
  async parseToMesh(e2, t2, n2, r2, i3) {
    if (t2[Hs] === void 0) return null;
    let a3 = t2[Hs], o3 = t2[Us], s3 = t2[Ws], c3 = ac(s3, this._maxSourceLevel), l3 = 2 ** (s3 - c3), u4 = Math.floor(a3 / l3), d5 = Math.floor(o3 / l3), f4;
    try {
      f4 = await this._gridCache.lock(u4, d5, c3);
    } catch (e3) {
      if (e3.name !== "AbortError") throw e3;
      return null;
    }
    if (i3.aborted) return this._gridCache.release(u4, d5, c3), null;
    t2[Gs] = f4, t2[Ks] = [
      u4,
      d5,
      c3
    ];
    let p4 = this._getSubview(t2), m4 = this._createTerrainMesh(t2, p4), h5 = f4.clone();
    m4.material.displacementMap = h5, this.unlit || (m4.material.bumpMap = h5), t2.children.forEach((e3) => {
      e3[Ys] || (e3[Ys] = t2[Ys], this._updateBoundingVolume(e3));
    });
    let { overlay: g5, applyOverlayTexture: _6 } = this;
    if (g5 && _6) {
      let e3 = this._tiling.getTileBounds(a3, o3, s3, true, false);
      if (g5.hasContent(e3, s3)) {
        try {
          await g5.lockTexture(e3, s3);
        } catch (e4) {
          if (e4.name !== "AbortError") throw e4;
          return this._releaseGrid(t2), null;
        }
        if (t2[qs] = e3, t2[Js] = s3, i3.aborted) return g5.releaseTexture(e3, s3), delete t2[qs], delete t2[Js], this._releaseGrid(t2), null;
        let [n3, r3, c4, l4] = oc(f4, p4), u5 = this._tiling.getTileContentUVBounds(a3, o3, s3), d6 = (u5[2] - u5[0]) / (c4 - n3), h6 = (u5[3] - u5[1]) / (l4 - r3), _7 = g5.getTexture(e3, s3).clone();
        _7.offset.set(u5[0] - n3 * d6, u5[1] - r3 * h6), _7.repeat.set(d6, h6), m4.material.map = _7, m4.material.needsUpdate = true;
      }
    }
    return m4.material.displacementScale = this._heightScale, m4.material.bumpScale = this._heightScale, m4;
  }
  raycastTile(e2, t2, n2, r2) {
    let i3 = e2[Gs];
    return i3 ? (t2.traverse((e3) => {
      if (e3.isMesh) {
        let t3 = ic(), a3 = e3.geometry.attributes.position, o3 = e3.geometry.attributes.normal, s3 = e3.geometry.attributes.uv, c3 = t3.geometry.attributes.position;
        for (let e4 = 0, t4 = c3.count; e4 < t4; e4++) {
          let t5 = sc(i3, s3.getX(e4), s3.getY(e4)) * this._heightScale;
          Q4.fromBufferAttribute(a3, e4), $4.fromBufferAttribute(o3, e4), Q4.addScaledVector($4, t5), c3.setXYZ(e4, Q4.x, Q4.y, Q4.z);
        }
        t3.geometry.computeBoundingSphere(), t3.matrixWorld.copy(e3.matrixWorld), tc.length = 0, t3.raycast(n2, tc), tc.forEach((t4) => {
          t4.object = e3, r2.push(t4);
        });
      }
    }), true) : false;
  }
  sampleCartographicElevation(e2, t2) {
    let n2 = this._tiling;
    if (n2 === null || !n2.projection.isCartographic) return null;
    let { projection: r2 } = n2, [i3, a3] = r2.fromCartographicToNormalized(t2, e2, nc);
    for (let e3 = this._maxSourceLevel; e3 >= 0; e3 -= $s) {
      let [t3, r3] = n2.getTileAtPoint(i3, a3, e3, true), o3 = this._gridCache.get(t3, r3, e3);
      if (o3 && !(o3 instanceof Promise)) {
        let [s3, c3, l3, u4] = n2.getTileBounds(t3, r3, e3, true), { width: d5, height: f4 } = o3.image, p4 = (i3 - s3) / (l3 - s3), m4 = (a3 - c3) / (u4 - c3);
        return sc(o3, (p4 * (d5 - 2) + 1) / d5, (m4 * (f4 - 2) + 1) / f4) * this._heightScale;
      }
    }
    return null;
  }
  preprocessNode(e2) {
    let t2 = this._tiling.maxLevel;
    e2[Ws] < t2 && e2.parent !== null && this.expandChildren(e2);
  }
  disposeTile(e2) {
    let t2 = e2[qs];
    this.overlay && t2 && (this.overlay.releaseTexture(t2, e2[Js]), delete e2[qs], delete e2[Js]), this._releaseGrid(e2);
  }
  _releaseGrid(e2) {
    let t2 = e2[Ks];
    t2 && (this._gridCache.release(...t2), delete e2[Ks], delete e2[Gs]);
  }
  dispose() {
    this.tiles.forEachLoadedModel((e2, t2) => {
      this.disposeTile(t2);
    });
  }
  _getSubview(e2) {
    let t2 = e2[Hs], n2 = e2[Us], r2 = e2[Ws], [i3, a3, o3] = e2[Ks], s3 = this._tiling.getTileBounds(t2, n2, r2, true), c3 = this._tiling.getTileBounds(i3, a3, o3, true), l3 = 1 / (c3[2] - c3[0]), u4 = 1 / (c3[3] - c3[1]);
    return [
      (s3[0] - c3[0]) * l3,
      (s3[1] - c3[1]) * u4,
      (s3[2] - c3[0]) * l3,
      (s3[3] - c3[1]) * u4
    ];
  }
  _createTerrainMesh(e2, t2) {
    let { tiles: n2, endCaps: r2, unlit: i3, _heightScale: a3, _tiling: o3 } = this, { surface: s3 } = n2, { projection: c3 } = o3, l3 = e2[Ws], u4 = e2[Hs], d5 = e2[Us], [, f4, , p4] = o3.getTileBounds(u4, d5, l3), [m4, h5, g5, _6] = o3.getTileBounds(u4, d5, l3, true, true), v6 = e2[Gs], [y6, b6, x6, S5] = oc(v6, t2), C5 = new Is(1, 1, Xs, Xs), w5 = new ce3(C5, i3 ? new Vs() : new Bs());
    e2.engineData.boundingVolume.getSphere(ec2), w5.position.copy(ec2.center);
    let T6 = r2 && !(s3.projection && s3.projection.isMercator), { position: E5, normal: D6, uv: O5 } = C5.attributes, { surfaceVertexCount: k5, skirtSourceIndices: A6 } = C5, j5 = Infinity, M6 = -Infinity;
    for (let e3 = 0; e3 < k5; e3++) {
      let t3 = e3 % 33, n3 = Math.floor(e3 / 33), r3 = t3 / Xs, i4 = 1 - n3 / Xs, a4 = c3.fromNormalizedToCartographic(N4.mapLinear(r3, 0, 1, m4, g5), N4.mapLinear(i4, 0, 1, h5, _6), nc), o4 = a4[0], l4 = a4[1];
      if (c3.isMercator && T6 && (_6 === 1 && i4 === 1 && (l4 = Math.PI / 2), h5 === 0 && i4 === 0 && (l4 = -Math.PI / 2)), c3.isMercator && i4 !== 0 && i4 !== 1) {
        let e4 = c3.fromNormalizedToCartographic(0.5, 1, nc)[1], t4 = 1 / Xs, n4 = N4.mapLinear(i4 - t4, 0, 1, f4, p4), r4 = N4.mapLinear(i4 + t4, 0, 1, f4, p4);
        l4 > e4 && n4 < e4 && (l4 = e4), l4 < -e4 && r4 > -e4 && (l4 = -e4);
      }
      let [u5, d6] = c3.fromCartographicToNormalized(o4, l4, nc), C6 = N4.mapLinear(u5, m4, g5, 0, 1), w6 = N4.mapLinear(d6, h5, _6, 0, 1), k6 = N4.mapLinear(C6, 0, 1, y6, x6), A7 = N4.mapLinear(w6, 0, 1, b6, S5), ee5 = sc(v6, k6, A7);
      ee5 < j5 && (j5 = ee5), ee5 > M6 && (M6 = ee5), s3.getCartographicToPosition(l4, o4, 0, Q4).sub(ec2.center), s3.getCartographicToNormal(l4, o4, $4), E5.setXYZ(e3, Q4.x, Q4.y, Q4.z), D6.setXYZ(e3, $4.x, $4.y, $4.z), O5.setXY(e3, k6, A7);
    }
    let ee4 = e2.geometricError + (M6 - j5) * a3;
    for (let e3 = 0, t3 = A6.length; e3 < t3; e3++) {
      let t4 = A6[e3], n3 = k5 + e3;
      Q4.fromBufferAttribute(E5, t4), $4.fromBufferAttribute(D6, t4), Q4.addScaledVector($4, -ee4), E5.setXYZ(n3, Q4.x, Q4.y, Q4.z), D6.setXYZ(n3, $4.x, $4.y, $4.z), O5.setXY(n3, O5.getX(t4), O5.getY(t4));
    }
    return e2[Ys] = {
      min: j5,
      max: M6
    }, this._updateBoundingVolume(e2), w5;
  }
  _updateBoundingVolume(e2) {
    let t2 = this._heightScale, n2 = e2[Ws] === -1 ? 0 : e2.geometricError, r2 = e2[Ys], i3, a3;
    r2 ? (i3 = r2.min * t2 - n2 - (r2.max - r2.min) * t2, a3 = r2.max * t2 + n2) : (i3 = Zs * t2 - n2, a3 = Qs * t2);
    let { boundingVolume: o3, engineData: s3 } = e2;
    if (o3.region) {
      let e3 = o3.region;
      e3[4] = i3, e3[5] = a3, s3 && s3.boundingVolume && s3.boundingVolume.setRegionData(this.tiles.ellipsoid, ...e3);
    } else {
      let e3 = o3.box;
      e3[2] = (i3 + a3) / 2, e3[11] = (a3 - i3) / 2, s3 && s3.boundingVolume && s3.boundingVolume.setObbData(e3, s3.transform);
    }
  }
  _updateHeightScale() {
    let { tiles: e2 } = this;
    e2 && (e2.forEachLoadedModel((e3) => {
      e3.traverse((e4) => {
        e4.isMesh && (e4.material.displacementScale = this._heightScale, e4.material.bumpScale = this._heightScale);
      });
    }), e2.traverse((e3) => {
      this._updateBoundingVolume(e3);
    }, null, false));
  }
  getTileset() {
    let { tiles: e2, _tiling: t2 } = this, n2 = t2.minLevel, { tileCountX: r2, tileCountY: i3 } = t2.getLevel(n2), a3 = [];
    for (let e3 = 0; e3 < r2; e3++) for (let t3 = 0; t3 < i3; t3++) {
      let r3 = this.createChild(e3, t3, n2);
      r3 !== null && a3.push(r3);
    }
    let o3 = {
      asset: { version: "1.1" },
      geometricError: Infinity,
      root: {
        refine: "REPLACE",
        geometricError: Infinity,
        boundingVolume: this.createBoundingVolume(0, 0, -1),
        children: a3,
        [Ws]: -1,
        [Hs]: 0,
        [Us]: 0
      }
    };
    return e2.preprocessTileset(o3, ""), o3;
  }
  getUrl(e2, t2, n2) {
    let r2 = ac(n2, this._maxSourceLevel), i3 = 2 ** (n2 - r2);
    return this._source.getUrl(Math.floor(e2 / i3), Math.floor(t2 / i3), r2);
  }
  fetchData() {
    return /* @__PURE__ */ new ArrayBuffer();
  }
  createBoundingVolume(e2, t2, n2, r2 = 0) {
    let { _tiling: i3, endCaps: a3, tiles: o3 } = this, { surface: s3 } = o3, c3 = n2 === -1, l3 = Zs * this.heightScale - r2, u4 = Qs * this.heightScale;
    if (s3.isEllipsoid) {
      let r3, o4;
      return c3 ? (r3 = i3.getContentBounds(true), o4 = i3.getContentBounds()) : (r3 = i3.getTileBounds(e2, t2, n2, true, true), o4 = i3.getTileBounds(e2, t2, n2, false, true)), a3 && (r3[3] === 1 && (o4[3] = Math.PI / 2), r3[1] === 0 && (o4[1] = -Math.PI / 2)), { region: [
        ...o4,
        l3,
        u4
      ] };
    } else {
      let r3;
      r3 = c3 ? i3.getContentBounds(true) : i3.getTileBounds(e2, t2, n2, true);
      let [o4, d5, f4, p4] = r3, m4 = N4.clamp(i3.projection.fromCartographicToNormalized(0, 0, nc)[1], d5, p4), h5 = Infinity, g5 = Infinity, _6 = -Infinity, v6 = -Infinity;
      for (let e3 of [
        d5,
        p4,
        m4
      ]) for (let t3 of [o4, f4]) {
        let [n3, r4] = i3.projection.fromNormalizedToCartographic(t3, e3, nc), o5 = r4;
        a3 && !s3.projection.isMercator && (e3 === 1 && (o5 = Math.PI / 2), e3 === 0 && (o5 = -Math.PI / 2)), s3.getCartographicToPosition(o5, n3, 0, Q4), h5 = Math.min(h5, Q4.x), g5 = Math.min(g5, Q4.y), _6 = Math.max(_6, Q4.x), v6 = Math.max(v6, Q4.y);
      }
      let y6 = { box: [
        (h5 + _6) / 2,
        (g5 + v6) / 2,
        (l3 + u4) / 2,
        (_6 - h5) / 2,
        0,
        0,
        0,
        (v6 - g5) / 2,
        0,
        0,
        0,
        (u4 - l3) / 2
      ] };
      return y6.cartographicRange = c3 ? i3.getContentBounds() : i3.getTileBounds(e2, t2, n2), y6;
    }
  }
  createChild(e2, t2, n2) {
    let { _tiling: r2, tiles: i3 } = this, { projection: a3 } = r2, { surface: o3 } = i3;
    if (!r2.getTileExists(e2, t2, n2)) return null;
    let s3;
    if (o3.isEllipsoid) {
      let [o4, c3, l3, u4] = r2.getTileBounds(e2, t2, n2, true), { tilePixelWidth: d5, tilePixelHeight: f4 } = r2.getLevel(n2), p4 = (l3 - o4) / d5, m4 = (u4 - c3) / f4, [, h5, g5, _6] = r2.getTileBounds(e2, t2, n2), v6 = h5 > 0 == _6 > 0 ? Math.min(Math.abs(h5), Math.abs(_6)) : 0, y6 = a3.fromCartographicToNormalized(0, v6, nc)[1], [b6, x6] = a3.getDerivativeAtNormalizedPoint(o4, y6, nc), [S5, C5] = Ve2(i3.ellipsoid, v6, g5);
      s3 = Math.max(p4 * b6 * S5, m4 * x6 * C5);
    } else {
      let { pixelWidth: e3, pixelHeight: t3 } = r2.getLevel(n2);
      s3 = Math.max(o3.scale.x / e3, o3.scale.y / t3);
    }
    return {
      refine: "REPLACE",
      geometricError: s3,
      boundingVolume: this.createBoundingVolume(e2, t2, n2, s3),
      content: { uri: this.getUrl(e2, t2, n2) },
      children: [],
      [Hs]: e2,
      [Us]: t2,
      [Ws]: n2
    };
  }
  expandChildren(e2) {
    let t2 = e2[Ws], n2 = e2[Hs], r2 = e2[Us], { tileSplitX: i3, tileSplitY: a3 } = this._tiling.getLevel(t2);
    for (let o3 = 0; o3 < i3; o3++) for (let s3 = 0; s3 < a3; s3++) {
      let c3 = this.createChild(i3 * n2 + o3, a3 * r2 + s3, t2 + 1);
      c3 && e2.children.push(c3);
    }
  }
  decodeElevation(e2, t2, n2) {
    return -1e4 + (e2 * 65536 + t2 * 256 + n2) * 0.1;
  }
};
var lc = class extends cc {
  constructor(e2 = {}) {
    super(e2), this.name = "TERRARIUM_MESH_PLUGIN";
  }
  decodeElevation(e2, t2, n2) {
    return e2 * 256 + t2 + n2 / 256 - 32768;
  }
};
var uc = null;
function dc() {
  return uc ?? (uc = Promise.all([Promise.resolve().then(() => (init_vector_tile(), vector_tile_exports)), Promise.resolve().then(() => (init_pbf(), pbf_exports))]).then(([{ VectorTile: e2 }, { default: t2 }]) => ({
    VectorTile: e2,
    Protobuf: t2
  })));
}
var fc = {
  earth: {
    fill: "#e2dfda",
    order: 0
  },
  water: {
    fill: "#80deea",
    order: 1
  },
  landcover: {
    fill: "#c4e7d2",
    order: 2
  },
  landuse: {
    fill: "#cfddd5",
    order: 3
  },
  natural: {
    fill: "#e2e0d7",
    order: 4
  },
  buildings: {
    fill: "#cccccc",
    order: 5
  },
  roads: {
    stroke: "#ebebeb",
    order: 6
  },
  transit: {
    stroke: "#a7b1b3",
    order: 7
  },
  boundaries: {
    stroke: "#adadad",
    order: 8
  },
  places: {
    fill: "#5c5c5c",
    order: 9
  },
  pois: {
    fill: "#1a8cbd",
    radius: 3,
    order: 10
  }
};
var pc = (e2, t2) => fc[e2] ?? null;
var mc = class extends xt2 {
  constructor(e2 = {}) {
    super();
    let { url: t2 = null, levels: n2 = 20, projection: r2 = "EPSG:3857" } = e2;
    this.url = t2, this.levels = n2, this.projectionId = r2, this.tiling = new it2(), this.fetchData = (...e3) => fetch(...e3), this.fetchOptions = {};
  }
  init() {
    let { tiling: e2, levels: t2, url: n2, projectionId: r2 } = this;
    return e2.flipY = !/{\s*reverseY|-\s*y\s*}/g.test(n2), e2.setProjection(new R5(r2)), e2.setContentBounds(...e2.projection.getBounds()), Array.isArray(t2) ? t2.forEach((t3, n3) => {
      t3 !== null && e2.setLevel(n3, {
        tilePixelWidth: 512,
        tilePixelHeight: 512,
        ...t3
      });
    }) : e2.generateLevels(t2, e2.projection.tileCountX, e2.projection.tileCountY, {
      tilePixelWidth: 512,
      tilePixelHeight: 512
    }), Promise.resolve();
  }
  async fetchItem([e2, t2, n2], r2) {
    let i3 = this.getUrl(e2, t2, n2), a3 = await (await this.fetchData(i3, {
      ...this.fetchOptions,
      signal: r2
    })).arrayBuffer();
    return this._parseVectorTile(a3);
  }
  async _parseVectorTile(e2) {
    if (!e2 || e2.byteLength === 0) return null;
    let { VectorTile: t2, Protobuf: n2 } = await dc();
    return new t2(new n2(e2));
  }
  disposeItem() {
  }
  getUrl(e2, t2, n2) {
    return this.url.replace(/{\s*z\s*}/gi, n2).replace(/{\s*x\s*}/gi, e2).replace(/{\s*(y|reverseY|-\s*y)\s*}/gi, t2);
  }
};
var hc = class extends Kt2 {
  get tiling() {
    return this._contentCache.tiling;
  }
  get fetchData() {
    return this._contentCache.fetchData;
  }
  set fetchData(e2) {
    this._contentCache.fetchData = e2;
  }
  get fetchOptions() {
    return this._contentCache.fetchOptions;
  }
  set fetchOptions(e2) {
    this._contentCache.fetchOptions = e2;
  }
  constructor(e2 = {}) {
    let { resolution: t2 = 512, getStyle: n2 = null, contentCache: r2, ...i3 } = e2;
    super(), this.resolution = t2, this.getStyle = n2, this._canvasRenderer = new Yt2({ tileExtent: 4096 }), this._contentCache = r2 ?? new mc(i3);
  }
  init() {
    return this._contentCache.init();
  }
  hasContent(e2, t2, n2, r2, i3) {
    let a3 = 0;
    return Et2([
      e2,
      t2,
      n2,
      r2
    ], i3, this._contentCache.tiling, () => a3++), a3 > 0;
  }
  async fetchItem([e2, t2, n2, r2, i3], a3) {
    let { resolution: o3, _contentCache: s3 } = this, c3 = document.createElement("canvas");
    c3.width = o3, c3.height = o3;
    let l3 = [
      e2,
      t2,
      n2,
      r2
    ], u4 = [];
    Et2(l3, i3, s3.tiling, (e3, t3, n3) => {
      u4.push(s3.lock(e3, t3, n3));
    }), await Promise.all(u4), a3?.throwIfAborted(), this._drawToCanvas(c3, l3, i3);
    let d5 = new C4(c3);
    return d5.colorSpace = Ce2, d5.generateMipmaps = false, d5.needsUpdate = true, d5;
  }
  disposeItem(e2, [t2, n2, r2, i3, a3]) {
    Et2([
      t2,
      n2,
      r2,
      i3
    ], a3, this._contentCache.tiling, (e3, t3, n3) => {
      this._contentCache.release(e3, t3, n3);
    }), e2 && e2.dispose();
  }
  redraw(...e2) {
    let [t2, n2, r2, i3, a3] = e2, o3 = this.get(t2, n2, r2, i3, a3);
    o3 && (this._drawToCanvas(o3.image, [
      t2,
      n2,
      r2,
      i3
    ], a3), o3.needsUpdate = true);
  }
  dispose() {
    super.dispose(), this._contentCache.dispose();
  }
  _drawToCanvas(e2, t2, n2) {
    let { _contentCache: r2, _canvasRenderer: i3 } = this, a3 = e2.getContext("2d");
    Et2(t2, n2, r2.tiling, (e3, n3, o3) => {
      let s3 = r2.tiling.getTileBounds(e3, n3, o3, true, false);
      i3.setFrame(a3, s3, t2);
      let c3 = r2.get(e3, n3, o3);
      c3 && this._renderVectorTile(c3);
    });
  }
  _renderVectorTile(e2) {
    let { _canvasRenderer: t2 } = this, n2 = this.getStyle || pc, r2 = [...Object.keys(e2.layers)].sort((e3, t3) => {
      let r3 = n2(e3, null)?.order ?? Yt2.DEFAULT_STYLE.order, i3 = n2(t3, null)?.order ?? Yt2.DEFAULT_STYLE.order;
      return r3 === i3 ? e3.localeCompare(t3) : r3 - i3;
    });
    for (let i3 of r2) {
      let r3 = e2.layers[i3];
      for (let e3 = 0; e3 < r3.length; e3++) {
        let a3 = r3.feature(e3), { properties: o3, type: s3 } = a3, c3 = n2(i3, o3);
        t2.setStyle(c3);
        let l3 = a3.loadGeometry();
        s3 === 1 ? t2._renderPoints(l3) : s3 === 2 ? t2._renderLines(l3) : s3 === 3 && t2._renderPolygons(l3);
      }
    }
  }
};
var gc = Math.PI / 180;
var _c = null;
function vc() {
  return _c ?? (_c = Promise.resolve().then(() => (init_esm(), esm_exports)).then((e2) => e2.PMTiles));
}
var yc = class extends St2 {
  constructor(e2, t2) {
    super(), this.instance = e2, this.tiling = t2;
  }
  async fetchItem([e2, t2, n2], r2) {
    let i3 = await this.instance.getZxy(n2, e2, t2, r2);
    return !i3 || !i3.data || i3.data.byteLength === 0 ? null : this.processBufferToTexture(i3.data);
  }
};
var bc = class extends mc {
  constructor(e2 = {}) {
    super(e2), this.instance = null, this.tileType = 1;
  }
  async init() {
    let { tiling: e2 } = this, t2 = await vc();
    this.instance = new t2({
      getKey: () => this.url,
      getBytes: async (e3, t3, n3) => {
        n3 && n3.throwIfAborted();
        let { fetchOptions: r3, url: i3 } = this, a3 = await this.fetchData(i3, {
          ...r3,
          signal: n3,
          headers: {
            ...r3.headers,
            range: `bytes=${e3}-${e3 + t3 - 1}`
          }
        });
        if (!a3.ok) throw Error(`PMTilesImageSource: Bad response code: ${a3.status}`);
        if (a3.status !== 206) throw Error("PMTilesImageSource: Server does not support HTTP Byte Serving.");
        return {
          data: await a3.arrayBuffer(),
          etag: a3.headers.get("ETag"),
          cacheControl: a3.headers.get("Cache-Control"),
          expires: a3.headers.get("Expires")
        };
      }
    });
    let n2 = await this.instance.getHeader();
    this.tileType = n2.tileType;
    let r2 = new R5("EPSG:3857");
    e2.flipY = true, e2.setProjection(r2), e2.setContentBounds(gc * n2.minLon, gc * n2.minLat, gc * n2.maxLon, gc * n2.maxLat), e2.generateLevels(n2.maxZoom + 1, r2.tileCountX, r2.tileCountY, {
      tilePixelWidth: 512,
      tilePixelHeight: 512,
      minLevel: n2.minZoom
    });
  }
  async fetchItem([e2, t2, n2], r2) {
    let i3 = await this.instance.getZxy(n2, e2, t2, r2);
    return this._parseVectorTile(i3 ? i3.data : null);
  }
};
var xc = class extends Kt2 {
  get tiling() {
    return this._contentCache.tiling;
  }
  get fetchData() {
    return this._contentCache.fetchData;
  }
  set fetchData(e2) {
    this._contentCache.fetchData = e2;
  }
  get resolution() {
    return this._resolution;
  }
  set resolution(e2) {
    this._resolution = e2, this._deferredSource && (this._deferredSource.resolution = e2);
  }
  get fetchOptions() {
    return this._contentCache.fetchOptions;
  }
  set fetchOptions(e2) {
    this._contentCache.fetchOptions = e2;
  }
  constructor(e2 = {}) {
    super();
    let { resolution: t2 = 512, getStyle: n2 = null } = e2;
    this._resolution = t2, this._getStyle = n2, this._contentCache = new bc(e2), this._deferredSource = null, this.isVectorTile = false;
  }
  async init() {
    await this._contentCache.init();
    let { _contentCache: e2 } = this;
    if (this.isVectorTile = e2.tileType === 1, this.isVectorTile) this._deferredSource = new hc({
      resolution: this._resolution,
      getStyle: this._getStyle,
      contentCache: e2
    });
    else {
      let t2 = new yc(e2.instance, e2.tiling);
      this._deferredSource = new qt2(t2), this._deferredSource.resolution = this._resolution;
    }
  }
  hasContent(e2, t2, n2, r2, i3) {
    return this._deferredSource.hasContent(e2, t2, n2, r2, i3);
  }
  lock(...e2) {
    return this._deferredSource.lock(...e2);
  }
  release(...e2) {
    this._deferredSource.release(...e2);
  }
  get(...e2) {
    return this._deferredSource.get(...e2);
  }
  redraw(...e2) {
    this._deferredSource instanceof hc && this._deferredSource.redraw(...e2);
  }
  forEachItem(...e2) {
    return this._deferredSource.forEachItem(...e2);
  }
  dispose() {
    super.dispose(), this._contentCache.dispose(), this._deferredSource && this._deferredSource.dispose();
  }
};
var Sc = class extends mn2 {
  get tiling() {
    return this.imageSource.tiling;
  }
  get projection() {
    return this.tiling.projection;
  }
  get aspectRatio() {
    return this.tiling && this.isReady ? this.tiling.aspectRatio : 1;
  }
  get fetchOptions() {
    return this.imageSource.fetchOptions;
  }
  set fetchOptions(e2) {
    this.imageSource.fetchOptions = e2;
  }
  get resolution() {
    return this.imageSource.resolution;
  }
  constructor(e2 = {}) {
    super(e2), this.imageSource = e2.imageSource ?? new hc(e2), this._redrawQueue = new c(), this._redrawQueue.maxJobs = 4, this._redrawQueue.priorityCallback = () => 0;
  }
  _init() {
    return this.imageSource.fetchData = (...e2) => this.fetch(...e2), this.imageSource.init();
  }
  calculateLevel(e2, t2 = this.resolution) {
    let [n2, r2, i3, a3] = e2, o3 = i3 - n2, s3 = a3 - r2, c3 = this.tiling.maxLevel, l3 = 0;
    for (; l3 < c3; l3++) {
      let e3 = this.tiling.getLevel(l3);
      if (e3 == null) continue;
      let { pixelWidth: n3, pixelHeight: r3 } = e3;
      if (n3 >= t2 / o3 || r3 >= t2 / s3) break;
    }
    return l3;
  }
  hasContent(e2, t2 = this.calculateLevel(e2)) {
    return this.imageSource.hasContent(...e2, t2);
  }
  getTexture(e2, t2 = this.calculateLevel(e2)) {
    return this.imageSource.get(...e2, t2);
  }
  lockTexture(e2, t2 = this.calculateLevel(e2)) {
    return this.imageSource.lock(...e2, t2);
  }
  releaseTexture(e2, t2 = this.calculateLevel(e2)) {
    this.imageSource.release(...e2, t2);
  }
  setResolution(e2) {
    this.imageSource.resolution = e2;
  }
  shouldSplit(e2) {
    return true;
  }
  setRegionVisible(e2, t2) {
    if (super.setRegionVisible(e2, t2), t2) {
      let { _redrawQueue: t3 } = this, n2 = e2.join("_") + "_" + this.calculateLevel(e2);
      t3.has(n2) && t3.flush(n2);
    }
  }
  redraw() {
    let { imageSource: e2, _redrawQueue: t2, _visibleRegionCounts: n2 } = this;
    for (let { range: t3 } of n2.values()) e2.redraw(...t3, this.calculateLevel(t3));
    e2.forEachItem((r2, i3) => {
      let a3 = i3.join("_");
      !n2.has(a3) && !t2.has(a3) && t2.add(a3, () => {
        e2.redraw(...i3);
      });
    });
  }
};
var Cc = class extends Sc {
  constructor(e2 = {}) {
    super({
      ...e2,
      imageSource: new xc(e2)
    });
  }
  shouldSplit(e2) {
    return this.imageSource.isVectorTile ? true : this.tiling.maxLevel > this.calculateLevel(e2);
  }
};
var wc = g * Math.PI * 2;
var Tc = /* @__PURE__ */ new R5("EPSG:3857");
function Ec(e2) {
  return /:4326$/i.test(e2);
}
function Dc(e2) {
  return /:3857$/i.test(e2);
}
function Oc(e2) {
  return e2.trim().split(/\s+/).map((e3) => parseFloat(e3));
}
function kc(e2, t2) {
  Ec(t2) && ([e2[1], e2[0]] = [e2[0], e2[1]]);
}
function Ac(e2, t2) {
  if (Dc(t2)) return Tc.fromNormalizedToCartographic(0.5 + e2[0] / wc, 0.5 + e2[1] / wc, e2), e2[0] *= N4.RAD2DEG, e2[1] *= N4.RAD2DEG, e2;
}
function jc(e2) {
  e2[0] *= N4.DEG2RAD, e2[1] *= N4.DEG2RAD;
}
var Mc = class extends X {
  parse(e2) {
    let t2 = new TextDecoder("utf-8").decode(new Uint8Array(e2)), n2 = new DOMParser().parseFromString(t2, "text/xml"), r2 = n2.querySelector("Contents"), i3 = Vc(r2, "TileMatrixSet").map((e3) => zc(e3)), a3 = Vc(r2, "Layer").map((e3) => Pc(e3)), o3 = Nc(n2.querySelector("ServiceIdentification"));
    return a3.forEach((e3) => {
      e3.tileMatrixSets = e3.tileMatrixSetLinks.map((e4) => i3.find((t3) => t3.identifier === e4));
    }), {
      serviceIdentification: o3,
      tileMatrixSets: i3,
      layers: a3
    };
  }
};
function Nc(e2) {
  return {
    title: e2.querySelector("Title").textContent,
    abstract: e2.querySelector("Abstract")?.textContent || "",
    serviceType: e2.querySelector("ServiceType").textContent,
    serviceTypeVersion: e2.querySelector("ServiceTypeVersion").textContent
  };
}
function Pc(e2) {
  let t2 = e2.querySelector("Title").textContent, n2 = e2.querySelector("Identifier").textContent, r2 = e2.querySelector("Format").textContent, i3 = Vc(e2, "ResourceURL").map((e3) => Fc(e3)), a3 = Vc(e2, "TileMatrixSetLink").map((e3) => Vc(e3, "TileMatrixSet")[0].textContent), o3 = Vc(e2, "Style").map((e3) => Rc(e3)), s3 = Vc(e2, "Dimension").map((e3) => Ic(e3)), c3 = Lc(e2.querySelector("WGS84BoundingBox"));
  return c3 || (c3 = Lc(e2.querySelector("BoundingBox"))), {
    title: t2,
    identifier: n2,
    format: r2,
    dimensions: s3,
    tileMatrixSetLinks: a3,
    styles: o3,
    boundingBox: c3,
    resourceUrls: i3
  };
}
function Fc(e2) {
  return {
    template: e2.getAttribute("template"),
    format: e2.getAttribute("format"),
    resourceType: e2.getAttribute("resourceType")
  };
}
function Ic(e2) {
  return {
    identifier: e2.querySelector("Identifier").textContent,
    uom: e2.querySelector("UOM")?.textContent || "",
    defaultValue: e2.querySelector("Default").textContent,
    current: e2.querySelector("Current")?.textContent === "true",
    values: Vc(e2, "Value").map((e3) => e3.textContent)
  };
}
function Lc(e2) {
  if (!e2) return null;
  let t2 = e2.nodeName.endsWith("WGS84BoundingBox") ? "urn:ogc:def:crs:CRS::84" : e2.getAttribute("crs"), n2 = Oc(e2.querySelector("LowerCorner").textContent), r2 = Oc(e2.querySelector("UpperCorner").textContent);
  return kc(n2, t2), kc(r2, t2), Ac(n2, t2), Ac(r2, t2), jc(n2), jc(r2), {
    crs: t2,
    lowerCorner: n2,
    upperCorner: r2,
    bounds: [...n2, ...r2]
  };
}
function Rc(e2) {
  return {
    title: e2.querySelector("Title")?.textContent || null,
    identifier: e2.querySelector("Identifier").textContent,
    isDefault: e2.getAttribute("isDefault") === "true"
  };
}
function zc(e2) {
  let t2 = e2.querySelector("SupportedCRS").textContent, n2 = e2.querySelector("Title")?.textContent || "", r2 = e2.querySelector("Identifier").textContent, i3 = e2.querySelector("Abstract")?.textContent || "", a3 = [];
  return e2.querySelectorAll("TileMatrix").forEach((e3, n3) => {
    let r3 = Bc(e3), i4 = 28e-5 * r3.scaleDenominator, o3 = r3.tileWidth * r3.matrixWidth * i4, s3 = r3.tileHeight * r3.matrixHeight * i4, c3;
    kc(r3.topLeftCorner, t2), c3 = Dc(t2) ? [r3.topLeftCorner[0] + o3, r3.topLeftCorner[1] - s3] : [r3.topLeftCorner[0] + 360 * o3 / wc, r3.topLeftCorner[1] - 360 * s3 / wc], Ac(c3, t2), Ac(r3.topLeftCorner, t2), jc(c3), jc(r3.topLeftCorner), r3.bounds = [...r3.topLeftCorner, ...c3], [r3.bounds[1], r3.bounds[3]] = [r3.bounds[3], r3.bounds[1]], a3.push(r3);
  }), {
    title: n2,
    identifier: r2,
    abstract: i3,
    supportedCRS: t2,
    tileMatrices: a3
  };
}
function Bc(e2) {
  return {
    identifier: e2.querySelector("Identifier").textContent,
    tileWidth: parseFloat(e2.querySelector("TileWidth").textContent),
    tileHeight: parseFloat(e2.querySelector("TileHeight").textContent),
    matrixWidth: parseFloat(e2.querySelector("MatrixWidth").textContent),
    matrixHeight: parseFloat(e2.querySelector("MatrixHeight").textContent),
    scaleDenominator: parseFloat(e2.querySelector("ScaleDenominator").textContent),
    topLeftCorner: Oc(e2.querySelector("TopLeftCorner").textContent),
    bounds: null
  };
}
function Vc(e2, t2) {
  return [...e2.children].filter((e3) => e3.tagName === t2);
}
var Hc = g * Math.PI * 2;
var Uc = /* @__PURE__ */ new R5("EPSG:3857");
function Wc(e2) {
  return /:4326$/i.test(e2);
}
function Gc(e2) {
  return /:3857$/i.test(e2);
}
function Kc(e2, t2) {
  return Gc(t2) && (Uc.fromNormalizedToCartographic(0.5 + e2[0] / (Math.PI * 2 * Hc), 0.5 + e2[1] / (Math.PI * 2 * Hc), e2), e2[0] *= N4.RAD2DEG, e2[1] *= N4.RAD2DEG), e2;
}
function qc(e2, t2, n2) {
  let [r2, i3] = n2.split(".").map((e3) => parseInt(e3)), a3 = r2 === 1 && i3 < 3 || r2 < 1;
  Wc(t2) && a3 && ([e2[0], e2[1]] = [e2[1], e2[0]]);
}
function Jc(e2) {
  e2[0] *= N4.DEG2RAD, e2[1] *= N4.DEG2RAD;
}
function Yc(e2, t2) {
  if (!e2) return null;
  let n2 = e2.getAttribute("CRS") || e2.getAttribute("crs") || e2.getAttribute("SRS") || "", r2 = parseFloat(e2.getAttribute("minx")), i3 = parseFloat(e2.getAttribute("miny")), a3 = parseFloat(e2.getAttribute("maxx")), o3 = parseFloat(e2.getAttribute("maxy")), s3 = [r2, i3], c3 = [a3, o3];
  return qc(s3, n2, t2), qc(c3, n2, t2), Kc(s3, n2), Kc(c3, n2), Jc(s3), Jc(c3), {
    crs: n2,
    bounds: [...s3, ...c3]
  };
}
function Xc(e2) {
  let t2 = parseFloat(e2.querySelector("westBoundLongitude").textContent), n2 = parseFloat(e2.querySelector("eastBoundLongitude").textContent), r2 = parseFloat(e2.querySelector("southBoundLatitude").textContent), i3 = parseFloat(e2.querySelector("northBoundLatitude").textContent), a3 = [t2, r2], o3 = [n2, i3];
  return Jc(a3), Jc(o3), [...a3, ...o3];
}
function Zc(e2) {
  let t2 = parseFloat(e2.getAttribute("minx").textContent), n2 = parseFloat(e2.getAttribute("maxx").textContent), r2 = parseFloat(e2.getAttribute("miny").textContent), i3 = parseFloat(e2.getAttribute("maxy").textContent), a3 = [t2, r2], o3 = [n2, i3];
  return Jc(a3), Jc(o3), [...a3, ...o3];
}
function Qc(e2) {
  return {
    name: e2.querySelector("Name").textContent,
    title: e2.querySelector("Title").textContent,
    legends: [...e2.querySelectorAll("LegendURL")].map((e3) => ({
      width: parseInt(e3.getAttribute("width")),
      height: parseInt(e3.getAttribute("height")),
      format: e3.querySelector("Format").textContent,
      url: tl(e3.querySelector("OnlineResource"))
    }))
  };
}
function $c(e2, t2, n2 = {}) {
  let { styles: r2 = [], crs: i3 = [], contentBoundingBox: a3 = null, queryable: o3 = false, opaque: s3 = false } = n2, c3 = e2.querySelector(":scope > Name")?.textContent || null, l3 = e2.querySelector(":scope > Title")?.textContent || "", u4 = e2.querySelector(":scope > Abstract")?.textContent || "", d5 = [...e2.querySelectorAll(":scope > Keyword")].map((e3) => e3.textContent), f4 = [...e2.querySelectorAll(":scope > BoundingBox")].map((e3) => Yc(e3, t2));
  i3 = [...i3, ...Array.from(e2.querySelectorAll("CRS")).map((e3) => e3.textContent)], r2 = [...r2, ...Array.from(e2.querySelectorAll(":scope > Style")).map((e3) => Qc(e3))], e2.hasAttribute("queryable") && (o3 = e2.getAttribute("queryable") === "1"), e2.hasAttribute("opaque") && (s3 = e2.getAttribute("opaque") === "1"), e2.querySelector("EX_GeographicBoundingBox") ? a3 = Xc(e2.querySelector("EX_GeographicBoundingBox")) : e2.querySelector("LatLonBoundingBox") && (a3 = Zc(e2.querySelector("LatLonBoundingBox")));
  let p4 = Array.from(e2.querySelectorAll(":scope > Layer")).map((e3) => $c(e3, t2, {
    styles: r2,
    crs: i3,
    contentBoundingBox: a3,
    queryable: o3,
    opaque: s3
  }));
  return {
    name: c3,
    title: l3,
    abstract: u4,
    queryable: o3,
    opaque: s3,
    keywords: d5,
    crs: i3,
    boundingBoxes: f4,
    contentBoundingBox: a3,
    styles: r2,
    subLayers: p4
  };
}
function el(e2) {
  return {
    name: e2.querySelector("Name")?.textContent || "",
    title: e2.querySelector("Title")?.textContent || "",
    abstract: e2.querySelector("Abstract")?.textContent || "",
    keywords: Array.from(e2.querySelectorAll("Keyword")).map((e3) => e3.textContent),
    maxWidth: parseFloat(e2.querySelector("MaxWidth")) || null,
    maxHeight: parseFloat(e2.querySelector("MaxHeight")) || null,
    layerLimit: parseFloat(e2.querySelector("LayerLimit")) || null
  };
}
function tl(e2) {
  return e2 ? (e2.getAttribute("xlink:href") || e2.getAttributeNS("http://www.w3.org/1999/xlink", "href") || "").trim() : "";
}
function nl(e2) {
  let t2 = Array.from(e2.querySelectorAll("Format")).map((e3) => e3.textContent.trim()), n2 = Array.from(e2.querySelectorAll("DCPType")).map((e3) => {
    let t3 = e3.querySelector("HTTP"), n3 = t3.querySelector("Get OnlineResource") || t3.querySelector("Get > OnlineResource") || t3.querySelector("Get"), r2 = t3.querySelector("Post OnlineResource") || t3.querySelector("Post > OnlineResource") || t3.querySelector("Post");
    return {
      type: "HTTP",
      get: tl(n3),
      post: tl(r2)
    };
  });
  return {
    formats: t2,
    dcp: n2,
    href: n2[0].get
  };
}
function rl(e2) {
  let t2 = {};
  return Array.from(e2.querySelectorAll(":scope > *")).forEach((e3) => {
    let n2 = e3.localName;
    t2[n2] = nl(e3);
  }), t2;
}
function il(e2, t2 = []) {
  return e2.forEach((e3) => {
    e3.name !== null && t2.push(e3), il(e3.subLayers, t2);
  }), t2;
}
var al = class extends X {
  parse(e2) {
    let t2 = new TextDecoder("utf-8").decode(new Uint8Array(e2)), n2 = new DOMParser().parseFromString(t2, "text/xml"), r2 = (n2.querySelector("WMS_Capabilities") || n2.querySelector("WMT_MS_Capabilities")).getAttribute("version"), i3 = n2.querySelector("Capability"), a3 = el(n2.querySelector(":scope > Service")), o3 = rl(i3.querySelector(":scope > Request"));
    return {
      version: r2,
      service: a3,
      layers: il(Array.from(i3.querySelectorAll(":scope > Layer")).map((e3) => $c(e3, r2))),
      request: o3
    };
  }
};
export {
  _e as B3DMLoader,
  qi as BaseRegion,
  Fi as BatchedTilesPlugin,
  Ke as CAMERA_FRAME,
  ut as CMPTLoader,
  Yn as CameraTransitionManager,
  i2 as CesiumIonAuth,
  Sn2 as CesiumIonOverlay,
  ja as DebugTilesPlugin,
  _n2 as DeepZoomOverlay,
  ps as DefaultMVTAnnotationsDriver,
  Ge as ENU_FRAME,
  Je as Ellipsoid,
  kt as EllipsoidRegion,
  v3 as EnforceNonZeroErrorPlugin,
  kn as EnvironmentControls,
  ti as GLTFCesiumRTCExtension,
  ni as GLTFExtensionsPlugin,
  ei as GLTFMeshFeaturesExtension,
  Kr as GLTFStructuralMetadataExtension,
  vt2 as GeneratedSurfacePlugin,
  vn2 as GeoJSONOverlay,
  Ce as GeoUtils,
  Vn as GlobeControls,
  o2 as GoogleCloudAuth,
  u2 as GoogleCloudAuthPlugin,
  Cn2 as GoogleMapsOverlay,
  lt as I3DMLoader,
  mn2 as ImageOverlay,
  pn2 as ImageOverlayPlugin,
  _3 as ImplicitTilingPlugin,
  Ki as LoadRegionPlugin,
  ds as MVTAnnotationsDriver,
  ms as MVTAnnotationsPlugin,
  Jo as MVTGlyphAtlasTexture,
  Xo as MVTGlyphMaterial,
  rs as MVTGlyphs,
  is as MVTIconGlyphs,
  os as MVTLabelGlyphs,
  Sc as MVTOverlay,
  It as MemoryUtils,
  Zr as MeshFeatures,
  bt as OBB,
  Xi as OBBRegion,
  qe as OBJECT_FRAME,
  Cc as PMTilesOverlay,
  Se as PNTSLoader,
  Os as PointCloudEffectsPlugin,
  Fs as PotreePlugin,
  b3 as QuantizedMeshLoaderBase,
  Zn as QuantizedMeshPlugin,
  Yi as RayRegion,
  ii as ReorientationPlugin,
  i as Scheduler,
  Ji as SphereRegion,
  Hr as StructuralMetadata,
  lt2 as TILE_LEVEL,
  st2 as TILE_X,
  ct2 as TILE_Y,
  xn2 as TMSTilesOverlay,
  cc as TerrainRGBMeshPlugin,
  lc as TerrariumMeshPlugin,
  ir as TileCompressionPlugin,
  Gi as TileFlatteningPlugin,
  hn2 as TiledImageOverlay,
  Ci as TilesFadePlugin,
  Yt as TilesRenderer,
  ai as UnloadTilesPlugin,
  er as UpdateOnChangePlugin,
  Ye as WGS84_ELLIPSOID,
  al as WMSCapabilitiesLoader,
  yn2 as WMSTilesOverlay,
  Mc as WMTSCapabilitiesLoader,
  bn2 as WMTSTilesOverlay,
  gn2 as XYZTilesOverlay
};
