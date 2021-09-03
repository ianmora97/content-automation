!(function (t) {
    "use strict";
    function e() {}
    function i(t) {
        if (!t || "object" != typeof t) return !1;
        var e = z(t) || mt;
        return /object|function/.test(typeof e.Element)
            ? t instanceof e.Element
            : 1 === t.nodeType && "string" == typeof t.nodeName;
    }
    function r(t) {
        return t === mt || (!(!t || !t.Window) && t instanceof t.Window);
    }
    function s(t) {
        return !!t && t instanceof yt;
    }
    function n(t) {
        return o(t) && void 0 !== typeof t.length && a(t.splice);
    }
    function o(t) {
        return !!t && "object" == typeof t;
    }
    function a(t) {
        return "function" == typeof t;
    }
    function h(t) {
        return "number" == typeof t;
    }
    function p(t) {
        return "boolean" == typeof t;
    }
    function l(t) {
        return "string" == typeof t;
    }
    function c(t) {
        return !!l(t) && (ft.querySelector(t), !0);
    }
    function d(t, e) {
        for (var i in e) t[i] = e[i];
        return t;
    }
    function u(t, e) {
        for (var i in e) {
            var r = !1;
            for (var s in Kt)
                if (0 === i.indexOf(s) && Kt[s].test(i)) {
                    r = !0;
                    break;
                }
            r || (t[i] = e[i]);
        }
        return t;
    }
    function g(t, e) {
        (t.page = t.page || {}),
            (t.page.x = e.page.x),
            (t.page.y = e.page.y),
            (t.client = t.client || {}),
            (t.client.x = e.client.x),
            (t.client.y = e.client.y),
            (t.timeStamp = e.timeStamp);
    }
    function v(t, e, i) {
        var r = e.length > 1 ? M(e) : e[0];
        x(r, Dt),
            (t.page.x = Dt.x),
            (t.page.y = Dt.y),
            E(r, Dt),
            (t.client.x = Dt.x),
            (t.client.y = Dt.y),
            (t.timeStamp = new Date().getTime());
    }
    function m(t, e, i) {
        (t.page.x = i.page.x - e.page.x),
            (t.page.y = i.page.y - e.page.y),
            (t.client.x = i.client.x - e.client.x),
            (t.client.y = i.client.y - e.client.y),
            (t.timeStamp = new Date().getTime() - e.timeStamp);
        var r = Math.max(t.timeStamp / 1e3, 0.001);
        (t.page.speed = zt(t.page.x, t.page.y) / r),
            (t.page.vx = t.page.x / r),
            (t.page.vy = t.page.y / r),
            (t.client.speed = zt(t.client.x, t.page.y) / r),
            (t.client.vx = t.client.x / r),
            (t.client.vy = t.client.y / r);
    }
    function f(t) {
        return (
            t instanceof mt.Event || (kt && mt.Touch && t instanceof mt.Touch)
        );
    }
    function y(t, e, i) {
        return (
            (i = i || {}),
            (t = t || "page"),
            (i.x = e[t + "X"]),
            (i.y = e[t + "Y"]),
            i
        );
    }
    function x(t, e) {
        return (
            (e = e || {}),
            Vt && f(t)
                ? (y("screen", t, e), (e.x += mt.scrollX), (e.y += mt.scrollY))
                : y("page", t, e),
            e
        );
    }
    function E(t, e) {
        return (
            (e = e || {}), Vt && f(t) ? y("screen", t, e) : y("client", t, e), e
        );
    }
    function S(t) {
        return (
            (t = t || mt),
            {
                x: t.scrollX || t.document.documentElement.scrollLeft,
                y: t.scrollY || t.document.documentElement.scrollTop,
            }
        );
    }
    function b(t) {
        return h(t.pointerId) ? t.pointerId : t.identifier;
    }
    function w(t) {
        return t instanceof St ? t.correspondingUseElement : t;
    }
    function z(t) {
        if (r(t)) return t;
        var e = t.ownerDocument || t;
        return e.defaultView || e.parentWindow || mt;
    }
    function D(t) {
        var e =
            t instanceof xt ? t.getBoundingClientRect() : t.getClientRects()[0];
        return (
            e && {
                left: e.left,
                right: e.right,
                top: e.top,
                bottom: e.bottom,
                width: e.width || e.right - e.left,
                height: e.height || e.bottom - e.top,
            }
        );
    }
    function T(t) {
        var e = D(t);
        if (!$t && e) {
            var i = S(z(t));
            (e.left += i.x),
                (e.right += i.x),
                (e.top += i.y),
                (e.bottom += i.y);
        }
        return e;
    }
    function C(t) {
        var e = [];
        return (
            n(t)
                ? ((e[0] = t[0]), (e[1] = t[1]))
                : "touchend" === t.type
                ? 1 === t.touches.length
                    ? ((e[0] = t.touches[0]), (e[1] = t.changedTouches[0]))
                    : 0 === t.touches.length &&
                      ((e[0] = t.changedTouches[0]),
                      (e[1] = t.changedTouches[1]))
                : ((e[0] = t.touches[0]), (e[1] = t.touches[1])),
            e
        );
    }
    function M(t) {
        for (
            var e,
                i = {
                    pageX: 0,
                    pageY: 0,
                    clientX: 0,
                    clientY: 0,
                    screenX: 0,
                    screenY: 0,
                },
                r = 0;
            r < t.length;
            r++
        )
            for (e in i) i[e] += t[r][e];
        for (e in i) i[e] /= t.length;
        return i;
    }
    function P(t) {
        if (t.length || (t.touches && t.touches.length > 1)) {
            var e = C(t),
                i = Math.min(e[0].pageX, e[1].pageX),
                r = Math.min(e[0].pageY, e[1].pageY);
            return {
                x: i,
                y: r,
                left: i,
                top: r,
                width: Math.max(e[0].pageX, e[1].pageX) - i,
                height: Math.max(e[0].pageY, e[1].pageY) - r,
            };
        }
    }
    function A(t, e) {
        var i = (e = e || Ot.deltaSource) + "X",
            r = e + "Y",
            s = C(t),
            n = s[0][i] - s[1][i],
            o = s[0][r] - s[1][r];
        return zt(n, o);
    }
    function O(t, e, i) {
        var r = (i = i || Ot.deltaSource) + "X",
            s = i + "Y",
            n = C(t),
            o = n[0][r] - n[1][r],
            a = n[0][s] - n[1][s],
            p = (180 * Math.atan(a / o)) / Math.PI;
        if (h(e)) {
            var l = (p - e) % 360;
            l > 315
                ? (p -= (360 + p / 360) | 0)
                : l > 135
                ? (p -= (180 + p / 360) | 0)
                : l < -315
                ? (p += (360 + p / 360) | 0)
                : l < -135 && (p += (180 + p / 360) | 0);
        }
        return p;
    }
    function _(t, e) {
        var r = t ? t.options.origin : Ot.origin;
        return (
            "parent" === r
                ? (r = F(e))
                : "self" === r
                ? (r = t.getRect(e))
                : c(r) && (r = I(e, r) || { x: 0, y: 0 }),
            a(r) && (r = r(t && e)),
            i(r) && (r = T(r)),
            (r.x = "x" in r ? r.x : r.left),
            (r.y = "y" in r ? r.y : r.top),
            r
        );
    }
    function k(t, e, i, r) {
        var s = 1 - t;
        return s * s * e + 2 * s * t * i + t * t * r;
    }
    function X(t, e, i, r, s, n, o) {
        return { x: k(o, t, i, s), y: k(o, e, r, n) };
    }
    function Y(t, e, i, r) {
        return (t /= r), -i * t * (t - 2) + e;
    }
    function R(t, e) {
        for (; e; ) {
            if (e === t) return !0;
            e = e.parentNode;
        }
        return !1;
    }
    function I(t, e) {
        for (var r = F(t); i(r); ) {
            if (dt(r, e)) return r;
            r = F(r);
        }
        return null;
    }
    function F(t) {
        var e = t.parentNode;
        if (s(e)) {
            for (; (e = e.host) && s(e); );
            return e;
        }
        return e;
    }
    function N(t, e) {
        return t._context === e.ownerDocument || R(t._context, e);
    }
    function q(t, e, r) {
        var s = t.options.ignoreFrom;
        return !(!s || !i(r)) && (l(s) ? ut(r, s, e) : !!i(s) && R(s, r));
    }
    function H(t, e, r) {
        var s = t.options.allowFrom;
        return !s || (!!i(r) && (l(s) ? ut(r, s, e) : !!i(s) && R(s, r)));
    }
    function W(t, e) {
        if (!e) return !1;
        var i = e.options.drag.axis;
        return "xy" === t || "xy" === i || i === t;
    }
    function U(t, e) {
        var i = t.options;
        return (
            /^resize/.test(e) && (e = "resize"), i[e].snap && i[e].snap.enabled
        );
    }
    function V(t, e) {
        var i = t.options;
        return (
            /^resize/.test(e) && (e = "resize"),
            i[e].restrict && i[e].restrict.enabled
        );
    }
    function $(t, e) {
        var i = t.options;
        return (
            /^resize/.test(e) && (e = "resize"),
            i[e].autoScroll && i[e].autoScroll.enabled
        );
    }
    function G(t, e, i) {
        for (
            var r = t.options,
                s = r[i.name].max,
                n = r[i.name].maxPerElement,
                o = 0,
                a = 0,
                h = 0,
                p = 0,
                l = Mt.length;
            p < l;
            p++
        ) {
            var c = Mt[p],
                d = c.prepared.name;
            if (c.interacting()) {
                if (++o >= Ft) return !1;
                if (c.target === t) {
                    if ((a += (d === i.name) | 0) >= s) return !1;
                    if (c.element === e && (h++, d !== i.name || h >= n))
                        return !1;
                }
            }
        }
        return Ft > 0;
    }
    function L(t) {
        var e,
            i,
            r,
            s,
            n,
            o = t[0],
            a = o ? 0 : -1,
            h = [],
            p = [];
        for (s = 1; s < t.length; s++)
            if ((e = t[s]) && e !== o)
                if (o) {
                    if (e.parentNode !== e.ownerDocument)
                        if (o.parentNode !== e.ownerDocument) {
                            if (!h.length)
                                for (
                                    i = o;
                                    i.parentNode &&
                                    i.parentNode !== i.ownerDocument;

                                )
                                    h.unshift(i), (i = i.parentNode);
                            if (
                                o instanceof bt &&
                                e instanceof xt &&
                                !(e instanceof Et)
                            ) {
                                if (e === o.parentNode) continue;
                                i = e.ownerSVGElement;
                            } else i = e;
                            for (p = []; i.parentNode !== i.ownerDocument; )
                                p.unshift(i), (i = i.parentNode);
                            for (n = 0; p[n] && p[n] === h[n]; ) n++;
                            var l = [p[n - 1], p[n], h[n]];
                            for (r = l[0].lastChild; r; ) {
                                if (r === l[1]) {
                                    (o = e), (a = s), (h = []);
                                    break;
                                }
                                if (r === l[2]) break;
                                r = r.previousSibling;
                            }
                        } else (o = e), (a = s);
                } else (o = e), (a = s);
        return a;
    }
    function j() {
        if (
            ((this.target = null),
            (this.element = null),
            (this.dropTarget = null),
            (this.dropElement = null),
            (this.prevDropTarget = null),
            (this.prevDropElement = null),
            (this.prepared = { name: null, axis: null, edges: null }),
            (this.matches = []),
            (this.matchElements = []),
            (this.inertiaStatus = {
                active: !1,
                smoothEnd: !1,
                ending: !1,
                startEvent: null,
                upCoords: {},
                xe: 0,
                ye: 0,
                sx: 0,
                sy: 0,
                t0: 0,
                vx0: 0,
                vys: 0,
                duration: 0,
                resumeDx: 0,
                resumeDy: 0,
                lambda_v0: 0,
                one_ve_v0: 0,
                i: null,
            }),
            a(Function.prototype.bind))
        )
            (this.boundInertiaFrame = this.inertiaFrame.bind(this)),
                (this.boundSmoothEndFrame = this.smoothEndFrame.bind(this));
        else {
            var t = this;
            (this.boundInertiaFrame = function () {
                return t.inertiaFrame();
            }),
                (this.boundSmoothEndFrame = function () {
                    return t.smoothEndFrame();
                });
        }
        (this.activeDrops = { dropzones: [], elements: [], rects: [] }),
            (this.pointers = []),
            (this.pointerIds = []),
            (this.downTargets = []),
            (this.downTimes = []),
            (this.holdTimers = []),
            (this.prevCoords = {
                page: { x: 0, y: 0 },
                client: { x: 0, y: 0 },
                timeStamp: 0,
            }),
            (this.curCoords = {
                page: { x: 0, y: 0 },
                client: { x: 0, y: 0 },
                timeStamp: 0,
            }),
            (this.startCoords = {
                page: { x: 0, y: 0 },
                client: { x: 0, y: 0 },
                timeStamp: 0,
            }),
            (this.pointerDelta = {
                page: { x: 0, y: 0, vx: 0, vy: 0, speed: 0 },
                client: { x: 0, y: 0, vx: 0, vy: 0, speed: 0 },
                timeStamp: 0,
            }),
            (this.downEvent = null),
            (this.downPointer = {}),
            (this._eventTarget = null),
            (this._curEventTarget = null),
            (this.prevEvent = null),
            (this.tapTime = 0),
            (this.prevTap = null),
            (this.startOffset = { left: 0, right: 0, top: 0, bottom: 0 }),
            (this.restrictOffset = { left: 0, right: 0, top: 0, bottom: 0 }),
            (this.snapOffsets = []),
            (this.gesture = {
                start: { x: 0, y: 0 },
                startDistance: 0,
                prevDistance: 0,
                distance: 0,
                scale: 1,
                startAngle: 0,
                prevAngle: 0,
            }),
            (this.snapStatus = {
                x: 0,
                y: 0,
                dx: 0,
                dy: 0,
                realX: 0,
                realY: 0,
                snappedX: 0,
                snappedY: 0,
                targets: [],
                locked: !1,
                changed: !1,
            }),
            (this.restrictStatus = {
                dx: 0,
                dy: 0,
                restrictedX: 0,
                restrictedY: 0,
                snap: null,
                restricted: !1,
                changed: !1,
            }),
            (this.restrictStatus.snap = this.snapStatus),
            (this.pointerIsDown = !1),
            (this.pointerWasMoved = !1),
            (this.gesturing = !1),
            (this.dragging = !1),
            (this.resizing = !1),
            (this.resizeAxes = "xy"),
            (this.mouse = !1),
            Mt.push(this);
    }
    function B(t, e, i) {
        var r,
            s = 0,
            n = Mt.length,
            o = /mouse/i.test(t.pointerType || e) || 4 === t.pointerType,
            a = b(t);
        if (/down|start/i.test(e))
            for (s = 0; s < n; s++) {
                var h = i;
                if (
                    (r = Mt[s]).inertiaStatus.active &&
                    r.target.options[r.prepared.name].inertia.allowResume &&
                    r.mouse === o
                )
                    for (; h; ) {
                        if (h === r.element) return r;
                        h = F(h);
                    }
            }
        if (o || (!kt && !Xt)) {
            for (s = 0; s < n; s++)
                if (Mt[s].mouse && !Mt[s].inertiaStatus.active) return Mt[s];
            for (s = 0; s < n; s++)
                if (
                    Mt[s].mouse &&
                    (!/down/.test(e) || !Mt[s].inertiaStatus.active)
                )
                    return r;
            return (r = new j()), (r.mouse = !0), r;
        }
        for (s = 0; s < n; s++) if (ct(Mt[s].pointerIds, a)) return Mt[s];
        if (/up|end|out/i.test(e)) return null;
        for (s = 0; s < n; s++)
            if (
                (!(r = Mt[s]).prepared.name ||
                    r.target.options.gesture.enabled) &&
                !r.interacting() &&
                (o || !r.mouse)
            )
                return r;
        return new j();
    }
    function K(t) {
        return function (e) {
            var i,
                r,
                s = w(e.path ? e.path[0] : e.target),
                n = w(e.currentTarget);
            if (kt && /touch/.test(e.type))
                for (
                    It = new Date().getTime(), r = 0;
                    r < e.changedTouches.length;
                    r++
                ) {
                    var o = e.changedTouches[r];
                    (i = B(o, e.type, s)) &&
                        (i._updateEventTargets(s, n), i[t](o, e, s, n));
                }
            else {
                if (!Xt && /mouse/.test(e.type)) {
                    for (r = 0; r < Mt.length; r++)
                        if (!Mt[r].mouse && Mt[r].pointerIsDown) return;
                    if (new Date().getTime() - It < 500) return;
                }
                if (!(i = B(e, e.type, s))) return;
                i._updateEventTargets(s, n), i[t](e, e, s, n);
            }
        };
    }
    function J(t, e, i, r, s, n) {
        var o,
            a,
            h = t.target,
            p = t.snapStatus,
            l = t.restrictStatus,
            c = t.pointers,
            u = ((h && h.options) || Ot).deltaSource,
            g = u + "X",
            v = u + "Y",
            m = h ? h.options : Ot,
            f = _(h, s),
            y = "start" === r,
            x = "end" === r,
            E = y ? t.startCoords : t.curCoords;
        (s = s || t.element),
            (a = d({}, E.page)),
            (o = d({}, E.client)),
            (a.x -= f.x),
            (a.y -= f.y),
            (o.x -= f.x),
            (o.y -= f.y);
        var S = m[i].snap && m[i].snap.relativePoints;
        !U(h, i) ||
            (y && S && S.length) ||
            ((this.snap = {
                range: p.range,
                locked: p.locked,
                x: p.snappedX,
                y: p.snappedY,
                realX: p.realX,
                realY: p.realY,
                dx: p.dx,
                dy: p.dy,
            }),
            p.locked &&
                ((a.x += p.dx), (a.y += p.dy), (o.x += p.dx), (o.y += p.dy))),
            !V(h, i) ||
                (y && m[i].restrict.elementRect) ||
                !l.restricted ||
                ((a.x += l.dx),
                (a.y += l.dy),
                (o.x += l.dx),
                (o.y += l.dy),
                (this.restrict = { dx: l.dx, dy: l.dy })),
            (this.pageX = a.x),
            (this.pageY = a.y),
            (this.clientX = o.x),
            (this.clientY = o.y),
            (this.x0 = t.startCoords.page.x - f.x),
            (this.y0 = t.startCoords.page.y - f.y),
            (this.clientX0 = t.startCoords.client.x - f.x),
            (this.clientY0 = t.startCoords.client.y - f.y),
            (this.ctrlKey = e.ctrlKey),
            (this.altKey = e.altKey),
            (this.shiftKey = e.shiftKey),
            (this.metaKey = e.metaKey),
            (this.button = e.button),
            (this.buttons = e.buttons),
            (this.target = s),
            (this.t0 = t.downTimes[0]),
            (this.type = i + (r || "")),
            (this.interaction = t),
            (this.interactable = h);
        var b = t.inertiaStatus;
        if (
            (b.active && (this.detail = "inertia"),
            n && (this.relatedTarget = n),
            x
                ? "client" === u
                    ? ((this.dx = o.x - t.startCoords.client.x),
                      (this.dy = o.y - t.startCoords.client.y))
                    : ((this.dx = a.x - t.startCoords.page.x),
                      (this.dy = a.y - t.startCoords.page.y))
                : y
                ? ((this.dx = 0), (this.dy = 0))
                : "inertiastart" === r
                ? ((this.dx = t.prevEvent.dx), (this.dy = t.prevEvent.dy))
                : "client" === u
                ? ((this.dx = o.x - t.prevEvent.clientX),
                  (this.dy = o.y - t.prevEvent.clientY))
                : ((this.dx = a.x - t.prevEvent.pageX),
                  (this.dy = a.y - t.prevEvent.pageY)),
            t.prevEvent &&
                "inertia" === t.prevEvent.detail &&
                !b.active &&
                m[i].inertia &&
                m[i].inertia.zeroResumeDelta &&
                ((b.resumeDx += this.dx),
                (b.resumeDy += this.dy),
                (this.dx = this.dy = 0)),
            "resize" === i && t.resizeAxes
                ? m.resize.square
                    ? ("y" === t.resizeAxes
                          ? (this.dx = this.dy)
                          : (this.dy = this.dx),
                      (this.axes = "xy"))
                    : ((this.axes = t.resizeAxes),
                      "x" === t.resizeAxes
                          ? (this.dy = 0)
                          : "y" === t.resizeAxes && (this.dx = 0))
                : "gesture" === i &&
                  ((this.touches = [c[0], c[1]]),
                  y
                      ? ((this.distance = A(c, u)),
                        (this.box = P(c)),
                        (this.scale = 1),
                        (this.ds = 0),
                        (this.angle = O(c, void 0, u)),
                        (this.da = 0))
                      : x || e instanceof J
                      ? ((this.distance = t.prevEvent.distance),
                        (this.box = t.prevEvent.box),
                        (this.scale = t.prevEvent.scale),
                        (this.ds = this.scale - 1),
                        (this.angle = t.prevEvent.angle),
                        (this.da = this.angle - t.gesture.startAngle))
                      : ((this.distance = A(c, u)),
                        (this.box = P(c)),
                        (this.scale = this.distance / t.gesture.startDistance),
                        (this.angle = O(c, t.gesture.prevAngle, u)),
                        (this.ds = this.scale - t.gesture.prevScale),
                        (this.da = this.angle - t.gesture.prevAngle))),
            y)
        )
            (this.timeStamp = t.downTimes[0]),
                (this.dt = 0),
                (this.duration = 0),
                (this.speed = 0),
                (this.velocityX = 0),
                (this.velocityY = 0);
        else if ("inertiastart" === r)
            (this.timeStamp = t.prevEvent.timeStamp),
                (this.dt = t.prevEvent.dt),
                (this.duration = t.prevEvent.duration),
                (this.speed = t.prevEvent.speed),
                (this.velocityX = t.prevEvent.velocityX),
                (this.velocityY = t.prevEvent.velocityY);
        else if (
            ((this.timeStamp = new Date().getTime()),
            (this.dt = this.timeStamp - t.prevEvent.timeStamp),
            (this.duration = this.timeStamp - t.downTimes[0]),
            e instanceof J)
        ) {
            var w = this[g] - t.prevEvent[g],
                z = this[v] - t.prevEvent[v],
                D = this.dt / 1e3;
            (this.speed = zt(w, z) / D),
                (this.velocityX = w / D),
                (this.velocityY = z / D);
        } else
            (this.speed = t.pointerDelta[u].speed),
                (this.velocityX = t.pointerDelta[u].vx),
                (this.velocityY = t.pointerDelta[u].vy);
        if (
            (x || "inertiastart" === r) &&
            t.prevEvent.speed > 600 &&
            this.timeStamp - t.prevEvent.timeStamp < 150
        ) {
            var T =
                (180 *
                    Math.atan2(t.prevEvent.velocityY, t.prevEvent.velocityX)) /
                Math.PI;
            T < 0 && (T += 360);
            var C = 112.5 <= T && T < 247.5,
                M = 202.5 <= T && T < 337.5,
                k = !C && (292.5 <= T || T < 67.5),
                X = !M && 22.5 <= T && T < 157.5;
            this.swipe = {
                up: M,
                down: X,
                left: C,
                right: k,
                angle: T,
                speed: t.prevEvent.speed,
                velocity: {
                    x: t.prevEvent.velocityX,
                    y: t.prevEvent.velocityY,
                },
            };
        }
    }
    function Q() {
        this.originalEvent.preventDefault();
    }
    function Z(t) {
        var e = "";
        if (("drag" === t.name && (e = Nt.drag), "resize" === t.name))
            if (t.axis) e = Nt[t.name + t.axis];
            else if (t.edges) {
                for (
                    var i = "resize",
                        r = ["top", "bottom", "left", "right"],
                        s = 0;
                    s < 4;
                    s++
                )
                    t.edges[r[s]] && (i += r[s]);
                e = Nt[i];
            }
        return e;
    }
    function tt(t, e, r, s, n, o, a) {
        if (!e) return !1;
        if (!0 === e) {
            var p = h(o.width) ? o.width : o.right - o.left,
                l = h(o.height) ? o.height : o.bottom - o.top;
            if (
                (p < 0 &&
                    ("left" === t
                        ? (t = "right")
                        : "right" === t && (t = "left")),
                l < 0 &&
                    ("top" === t
                        ? (t = "bottom")
                        : "bottom" === t && (t = "top")),
                "left" === t)
            )
                return r.x < (p >= 0 ? o.left : o.right) + a;
            if ("top" === t) return r.y < (l >= 0 ? o.top : o.bottom) + a;
            if ("right" === t) return r.x > (p >= 0 ? o.right : o.left) - a;
            if ("bottom" === t) return r.y > (l >= 0 ? o.bottom : o.top) - a;
        }
        return !!i(s) && (i(e) ? e === s : ut(s, e, n));
    }
    function et(t, e, i) {
        var r,
            s = this.getRect(i),
            n = !1,
            a = null,
            h = null,
            p = d({}, e.curCoords.page),
            l = this.options;
        if (!s) return null;
        if (qt.resize && l.resize.enabled) {
            var c = l.resize;
            if (
                ((r = { left: !1, right: !1, top: !1, bottom: !1 }), o(c.edges))
            ) {
                for (var u in r)
                    r[u] = tt(
                        u,
                        c.edges[u],
                        p,
                        e._eventTarget,
                        i,
                        s,
                        c.margin || Yt
                    );
                (r.left = r.left && !r.right),
                    (r.top = r.top && !r.bottom),
                    (n = r.left || r.right || r.top || r.bottom);
            } else {
                var g = "y" !== l.resize.axis && p.x > s.right - Yt,
                    v = "x" !== l.resize.axis && p.y > s.bottom - Yt;
                (n = g || v), (h = (g ? "x" : "") + (v ? "y" : ""));
            }
        }
        return (
            (a = n ? "resize" : qt.drag && l.drag.enabled ? "drag" : null),
            qt.gesture &&
                e.pointerIds.length >= 2 &&
                !e.dragging &&
                !e.resizing &&
                (a = "gesture"),
            a ? { name: a, axis: h, edges: r } : null
        );
    }
    function it(t, e) {
        if (!o(t)) return null;
        var i = t.name,
            r = e.options;
        return (("resize" === i && r.resize.enabled) ||
            ("drag" === i && r.drag.enabled) ||
            ("gesture" === i && r.gesture.enabled)) &&
            qt[i]
            ? (("resize" !== i && "resizeyx" !== i) || (i = "resizexy"), t)
            : null;
    }
    function rt(t, e) {
        var r = {},
            s = At[t.type],
            n = w(t.path ? t.path[0] : t.target),
            o = n;
        e = !!e;
        for (var a in t) r[a] = t[a];
        for (r.originalEvent = t, r.preventDefault = Q; i(o); ) {
            for (var h = 0; h < s.selectors.length; h++) {
                var p = s.selectors[h],
                    l = s.contexts[h];
                if (dt(o, p) && R(l, n) && R(l, o)) {
                    var c = s.listeners[h];
                    r.currentTarget = o;
                    for (var d = 0; d < c.length; d++)
                        c[d][1] === e && c[d][0](r);
                }
            }
            o = F(o);
        }
    }
    function st(t) {
        return rt.call(this, t, !0);
    }
    function nt(t, e) {
        return Ct.get(t, e) || new ot(t, e);
    }
    function ot(t, e) {
        (this._element = t), (this._iEvents = this._iEvents || {});
        var r;
        if (c(t)) {
            this.selector = t;
            var s = e && e.context;
            (r = s ? z(s) : mt),
                s &&
                    (r.Node ? s instanceof r.Node : i(s) || s === r.document) &&
                    (this._context = s);
        } else
            i(t, (r = z(t))) &&
                (Xt
                    ? (Bt.add(this._element, gt.down, Jt.pointerDown),
                      Bt.add(this._element, gt.move, Jt.pointerHover))
                    : (Bt.add(this._element, "mousedown", Jt.pointerDown),
                      Bt.add(this._element, "mousemove", Jt.pointerHover),
                      Bt.add(this._element, "touchstart", Jt.pointerDown),
                      Bt.add(this._element, "touchmove", Jt.pointerHover)));
        (this._doc = r.document),
            ct(Tt, this._doc) || pt(this._doc),
            Ct.push(this),
            this.set(e);
    }
    function at(t, e) {
        var i = !1;
        return function () {
            return (
                i || (mt.console.warn(e), (i = !0)), t.apply(this, arguments)
            );
        };
    }
    function ht(t) {
        for (var e = 0; e < Mt.length; e++) Mt[e].pointerEnd(t, t);
    }
    function pt(t) {
        if (!ct(Tt, t)) {
            var e = t.defaultView || t.parentWindow;
            for (var i in At) Bt.add(t, i, rt), Bt.add(t, i, st, !0);
            Xt
                ? ((gt =
                      wt === e.MSPointerEvent
                          ? {
                                up: "MSPointerUp",
                                down: "MSPointerDown",
                                over: "mouseover",
                                out: "mouseout",
                                move: "MSPointerMove",
                                cancel: "MSPointerCancel",
                            }
                          : {
                                up: "pointerup",
                                down: "pointerdown",
                                over: "pointerover",
                                out: "pointerout",
                                move: "pointermove",
                                cancel: "pointercancel",
                            }),
                  Bt.add(t, gt.down, Jt.selectorDown),
                  Bt.add(t, gt.move, Jt.pointerMove),
                  Bt.add(t, gt.over, Jt.pointerOver),
                  Bt.add(t, gt.out, Jt.pointerOut),
                  Bt.add(t, gt.up, Jt.pointerUp),
                  Bt.add(t, gt.cancel, Jt.pointerCancel),
                  Bt.add(t, gt.move, Jt.autoScrollMove))
                : (Bt.add(t, "mousedown", Jt.selectorDown),
                  Bt.add(t, "mousemove", Jt.pointerMove),
                  Bt.add(t, "mouseup", Jt.pointerUp),
                  Bt.add(t, "mouseover", Jt.pointerOver),
                  Bt.add(t, "mouseout", Jt.pointerOut),
                  Bt.add(t, "touchstart", Jt.selectorDown),
                  Bt.add(t, "touchmove", Jt.pointerMove),
                  Bt.add(t, "touchend", Jt.pointerUp),
                  Bt.add(t, "touchcancel", Jt.pointerCancel),
                  Bt.add(t, "mousemove", Jt.autoScrollMove),
                  Bt.add(t, "touchmove", Jt.autoScrollMove)),
                Bt.add(e, "blur", ht);
            try {
                if (e.frameElement) {
                    var r = e.frameElement.ownerDocument,
                        s = r.defaultView;
                    Bt.add(r, "mouseup", Jt.pointerEnd),
                        Bt.add(r, "touchend", Jt.pointerEnd),
                        Bt.add(r, "touchcancel", Jt.pointerEnd),
                        Bt.add(r, "pointerup", Jt.pointerEnd),
                        Bt.add(r, "MSPointerUp", Jt.pointerEnd),
                        Bt.add(s, "blur", ht);
                }
            } catch (t) {
                nt.windowParentError = t;
            }
            Bt.add(t, "dragstart", function (t) {
                for (var e = 0; e < Mt.length; e++) {
                    var i = Mt[e];
                    if (
                        i.element &&
                        (i.element === t.target || R(i.element, t.target))
                    )
                        return void i.checkAndPreventDefault(
                            t,
                            i.target,
                            i.element
                        );
                }
            }),
                Bt.useAttachEvent &&
                    (Bt.add(t, "selectstart", function (t) {
                        var e = Mt[0];
                        e.currentAction() && e.checkAndPreventDefault(t);
                    }),
                    Bt.add(t, "dblclick", K("ie8Dblclick"))),
                Tt.push(t);
        }
    }
    function lt(t, e) {
        for (var i = 0, r = t.length; i < r; i++) if (t[i] === e) return i;
        return -1;
    }
    function ct(t, e) {
        return -1 !== lt(t, e);
    }
    function dt(e, i, r) {
        return vt
            ? vt(e, i, r)
            : (mt !== t && (i = i.replace(/\/deep\//g, " ")), e[Gt](i));
    }
    function ut(t, e, r) {
        for (; i(t); ) {
            if (dt(t, e)) return !0;
            if ((t = F(t)) === r) return dt(t, e);
        }
        return !1;
    }
    if (t) {
        var gt,
            vt,
            mt = (function () {
                var e = t.document.createTextNode("");
                return e.ownerDocument !== t.document &&
                    "function" == typeof t.wrap &&
                    t.wrap(e) === e
                    ? t.wrap(t)
                    : t;
            })(),
            ft = mt.document,
            yt = mt.DocumentFragment || e,
            xt = mt.SVGElement || e,
            Et = mt.SVGSVGElement || e,
            St = mt.SVGElementInstance || e,
            bt = mt.HTMLElement || mt.Element,
            wt = mt.PointerEvent || mt.MSPointerEvent,
            zt =
                Math.hypot ||
                function (t, e) {
                    return Math.sqrt(t * t + e * e);
                },
            Dt = {},
            Tt = [],
            Ct = [],
            Mt = [],
            Pt = !1,
            At = {},
            Ot = {
                base: {
                    accept: null,
                    actionChecker: null,
                    styleCursor: !0,
                    preventDefault: "auto",
                    origin: { x: 0, y: 0 },
                    deltaSource: "page",
                    allowFrom: null,
                    ignoreFrom: null,
                    _context: ft,
                    dropChecker: null,
                },
                drag: {
                    enabled: !1,
                    manualStart: !0,
                    max: 1 / 0,
                    maxPerElement: 1,
                    snap: null,
                    restrict: null,
                    inertia: null,
                    autoScroll: null,
                    axis: "xy",
                },
                drop: { enabled: !1, accept: null, overlap: "pointer" },
                resize: {
                    enabled: !1,
                    manualStart: !1,
                    max: 1 / 0,
                    maxPerElement: 1,
                    snap: null,
                    restrict: null,
                    inertia: null,
                    autoScroll: null,
                    square: !1,
                    preserveAspectRatio: !1,
                    axis: "xy",
                    margin: NaN,
                    edges: null,
                    invert: "none",
                },
                gesture: {
                    manualStart: !1,
                    enabled: !1,
                    max: 1 / 0,
                    maxPerElement: 1,
                    restrict: null,
                },
                perAction: {
                    manualStart: !1,
                    max: 1 / 0,
                    maxPerElement: 1,
                    snap: {
                        enabled: !1,
                        endOnly: !1,
                        range: 1 / 0,
                        targets: null,
                        offsets: null,
                        relativePoints: null,
                    },
                    restrict: { enabled: !1, endOnly: !1 },
                    autoScroll: {
                        enabled: !1,
                        container: null,
                        margin: 60,
                        speed: 300,
                    },
                    inertia: {
                        enabled: !1,
                        resistance: 10,
                        minSpeed: 100,
                        endSpeed: 10,
                        allowResume: !0,
                        zeroResumeDelta: !0,
                        smoothEndDuration: 300,
                    },
                },
                _holdDuration: 600,
            },
            _t = {
                interaction: null,
                i: null,
                x: 0,
                y: 0,
                scroll: function () {
                    var t,
                        e,
                        i,
                        s,
                        n =
                            _t.interaction.target.options[
                                _t.interaction.prepared.name
                            ].autoScroll,
                        o = n.container || z(_t.interaction.element),
                        a = new Date().getTime(),
                        h = (a - _t.prevTimeX) / 1e3,
                        p = (a - _t.prevTimeY) / 1e3;
                    n.velocity
                        ? ((t = n.velocity.x), (e = n.velocity.y))
                        : (t = e = n.speed),
                        (s = e * p),
                        ((i = t * h) >= 1 || s >= 1) &&
                            (r(o)
                                ? o.scrollBy(_t.x * i, _t.y * s)
                                : o &&
                                  ((o.scrollLeft += _t.x * i),
                                  (o.scrollTop += _t.y * s)),
                            i >= 1 && (_t.prevTimeX = a),
                            s >= 1 && (_t.prevTimeY = a)),
                        _t.isScrolling && (jt(_t.i), (_t.i = Lt(_t.scroll)));
                },
                isScrolling: !1,
                prevTimeX: 0,
                prevTimeY: 0,
                start: function (t) {
                    (_t.isScrolling = !0),
                        jt(_t.i),
                        (_t.interaction = t),
                        (_t.prevTimeX = new Date().getTime()),
                        (_t.prevTimeY = new Date().getTime()),
                        (_t.i = Lt(_t.scroll));
                },
                stop: function () {
                    (_t.isScrolling = !1), jt(_t.i);
                },
            },
            kt =
                "ontouchstart" in mt ||
                (mt.DocumentTouch && ft instanceof mt.DocumentTouch),
            Xt = wt && !/Chrome/.test(navigator.userAgent),
            Yt = kt || Xt ? 20 : 10,
            Rt = 1,
            It = 0,
            Ft = 1 / 0,
            Nt =
                ft.all && !mt.atob
                    ? {
                          drag: "move",
                          resizex: "e-resize",
                          resizey: "s-resize",
                          resizexy: "se-resize",
                          resizetop: "n-resize",
                          resizeleft: "w-resize",
                          resizebottom: "s-resize",
                          resizeright: "e-resize",
                          resizetopleft: "se-resize",
                          resizebottomright: "se-resize",
                          resizetopright: "ne-resize",
                          resizebottomleft: "ne-resize",
                          gesture: "",
                      }
                    : {
                          drag: "move",
                          resizex: "ew-resize",
                          resizey: "ns-resize",
                          resizexy: "nwse-resize",
                          resizetop: "ns-resize",
                          resizeleft: "ew-resize",
                          resizebottom: "ns-resize",
                          resizeright: "ew-resize",
                          resizetopleft: "nwse-resize",
                          resizebottomright: "nwse-resize",
                          resizetopright: "nesw-resize",
                          resizebottomleft: "nesw-resize",
                          gesture: "",
                      },
            qt = { drag: !0, resize: !0, gesture: !0 },
            Ht = "onmousewheel" in ft ? "mousewheel" : "wheel",
            Wt = [
                "dragstart",
                "dragmove",
                "draginertiastart",
                "dragend",
                "dragenter",
                "dragleave",
                "dropactivate",
                "dropdeactivate",
                "dropmove",
                "drop",
                "resizestart",
                "resizemove",
                "resizeinertiastart",
                "resizeend",
                "gesturestart",
                "gesturemove",
                "gestureinertiastart",
                "gestureend",
                "down",
                "move",
                "up",
                "cancel",
                "tap",
                "doubletap",
                "hold",
            ],
            Ut = {},
            Vt =
                "Opera" == navigator.appName &&
                kt &&
                navigator.userAgent.match("Presto"),
            $t =
                /iP(hone|od|ad)/.test(navigator.platform) &&
                /OS 7[^\d]/.test(navigator.appVersion),
            Gt =
                "matches" in Element.prototype
                    ? "matches"
                    : "webkitMatchesSelector" in Element.prototype
                    ? "webkitMatchesSelector"
                    : "mozMatchesSelector" in Element.prototype
                    ? "mozMatchesSelector"
                    : "oMatchesSelector" in Element.prototype
                    ? "oMatchesSelector"
                    : "msMatchesSelector",
            Lt = t.requestAnimationFrame,
            jt = t.cancelAnimationFrame,
            Bt = (function () {
                function t(e, i, r, n) {
                    var c,
                        d,
                        u,
                        g = lt(h, e),
                        v = p[g],
                        m = r;
                    if (v && v.events)
                        if (
                            (s &&
                                ((u = lt((d = l[g]).supplied, r)),
                                (m = d.wrapped[u])),
                            "all" !== i)
                        ) {
                            if (v.events[i]) {
                                var f = v.events[i].length;
                                if ("all" === r) {
                                    for (c = 0; c < f; c++)
                                        t(e, i, v.events[i][c], Boolean(n));
                                    return;
                                }
                                for (c = 0; c < f; c++)
                                    if (v.events[i][c] === r) {
                                        e[o](a + i, m, n || !1),
                                            v.events[i].splice(c, 1),
                                            s &&
                                                d &&
                                                0 === --d.useCount[u] &&
                                                (d.supplied.splice(u, 1),
                                                d.wrapped.splice(u, 1),
                                                d.useCount.splice(u, 1));
                                        break;
                                    }
                                v.events[i] &&
                                    0 === v.events[i].length &&
                                    ((v.events[i] = null), v.typeCount--);
                            }
                            v.typeCount ||
                                (p.splice(g, 1),
                                h.splice(g, 1),
                                l.splice(g, 1));
                        } else
                            for (i in v.events)
                                v.events.hasOwnProperty(i) && t(e, i, "all");
                }
                function e() {
                    this.returnValue = !1;
                }
                function i() {
                    this.cancelBubble = !0;
                }
                function r() {
                    (this.cancelBubble = !0),
                        (this.immediatePropagationStopped = !0);
                }
                var s = "attachEvent" in mt && !("addEventListener" in mt),
                    n = s ? "attachEvent" : "addEventListener",
                    o = s ? "detachEvent" : "removeEventListener",
                    a = s ? "on" : "",
                    h = [],
                    p = [],
                    l = [];
                return {
                    add: function (t, o, c, d) {
                        var u = lt(h, t),
                            g = p[u];
                        if (
                            (g ||
                                ((g = { events: {}, typeCount: 0 }),
                                (u = h.push(t) - 1),
                                p.push(g),
                                l.push(
                                    s
                                        ? {
                                              supplied: [],
                                              wrapped: [],
                                              useCount: [],
                                          }
                                        : null
                                )),
                            g.events[o] || ((g.events[o] = []), g.typeCount++),
                            !ct(g.events[o], c))
                        ) {
                            var v;
                            if (s) {
                                var m = l[u],
                                    f = lt(m.supplied, c),
                                    y =
                                        m.wrapped[f] ||
                                        function (s) {
                                            s.immediatePropagationStopped ||
                                                ((s.target = s.srcElement),
                                                (s.currentTarget = t),
                                                (s.preventDefault =
                                                    s.preventDefault || e),
                                                (s.stopPropagation =
                                                    s.stopPropagation || i),
                                                (s.stopImmediatePropagation =
                                                    s.stopImmediatePropagation ||
                                                    r),
                                                /mouse|click/.test(s.type) &&
                                                    ((s.pageX =
                                                        s.clientX +
                                                        z(t).document
                                                            .documentElement
                                                            .scrollLeft),
                                                    (s.pageY =
                                                        s.clientY +
                                                        z(t).document
                                                            .documentElement
                                                            .scrollTop)),
                                                c(s));
                                        };
                                (v = t[n](a + o, y, Boolean(d))),
                                    -1 === f
                                        ? (m.supplied.push(c),
                                          m.wrapped.push(y),
                                          m.useCount.push(1))
                                        : m.useCount[f]++;
                            } else v = t[n](o, c, d || !1);
                            return g.events[o].push(c), v;
                        }
                    },
                    remove: t,
                    useAttachEvent: s,
                    _elements: h,
                    _targets: p,
                    _attachedListeners: l,
                };
            })(),
            Kt = { webkit: /(Movement[XY]|Radius[XY]|RotationAngle|Force)$/ };
        (j.prototype = {
            getPageXY: function (t, e) {
                return x(t, e);
            },
            getClientXY: function (t, e) {
                return E(t, e);
            },
            setEventXY: function (t, e) {
                return v(t, e, this);
            },
            pointerOver: function (t, e, r) {
                if (!this.prepared.name && this.mouse) {
                    var s = [],
                        n = [],
                        o = this.element;
                    this.addPointer(t),
                        !this.target ||
                            (!q(this.target, this.element, r) &&
                                H(this.target, this.element, r)) ||
                            ((this.target = null),
                            (this.element = null),
                            (this.matches = []),
                            (this.matchElements = []));
                    var a = Ct.get(r),
                        h =
                            a &&
                            !q(a, r, r) &&
                            H(a, r, r) &&
                            it(a.getAction(t, e, this, r), a);
                    h && !G(a, r, h) && (h = null),
                        h
                            ? ((this.target = a),
                              (this.element = r),
                              (this.matches = []),
                              (this.matchElements = []))
                            : (Ct.forEachSelector(function (t, e) {
                                  t &&
                                      i(r) &&
                                      N(t, r) &&
                                      !q(t, r, r) &&
                                      H(t, r, r) &&
                                      dt(r, e) &&
                                      (s.push(t), n.push(r));
                              }),
                              this.validateSelector(t, e, s, n)
                                  ? ((this.matches = s),
                                    (this.matchElements = n),
                                    this.pointerHover(
                                        t,
                                        e,
                                        this.matches,
                                        this.matchElements
                                    ),
                                    Bt.add(
                                        r,
                                        Xt ? gt.move : "mousemove",
                                        Jt.pointerHover
                                    ))
                                  : this.target &&
                                    (R(o, r)
                                        ? (this.pointerHover(
                                              t,
                                              e,
                                              this.matches,
                                              this.matchElements
                                          ),
                                          Bt.add(
                                              this.element,
                                              Xt ? gt.move : "mousemove",
                                              Jt.pointerHover
                                          ))
                                        : ((this.target = null),
                                          (this.element = null),
                                          (this.matches = []),
                                          (this.matchElements = []))));
                }
            },
            pointerHover: function (t, e, i, r, s, n) {
                var o = this.target;
                if (!this.prepared.name && this.mouse) {
                    var a;
                    this.setEventXY(this.curCoords, [t]),
                        s
                            ? (a = this.validateSelector(t, e, s, n))
                            : o &&
                              (a = it(
                                  o.getAction(
                                      this.pointers[0],
                                      e,
                                      this,
                                      this.element
                                  ),
                                  this.target
                              )),
                        o &&
                            o.options.styleCursor &&
                            (o._doc.documentElement.style.cursor = a
                                ? Z(a)
                                : "");
                } else
                    this.prepared.name &&
                        this.checkAndPreventDefault(e, o, this.element);
            },
            pointerOut: function (t, e, i) {
                this.prepared.name ||
                    (Ct.get(i) ||
                        Bt.remove(
                            i,
                            Xt ? gt.move : "mousemove",
                            Jt.pointerHover
                        ),
                    this.target &&
                        this.target.options.styleCursor &&
                        !this.interacting() &&
                        (this.target._doc.documentElement.style.cursor = ""));
            },
            selectorDown: function (t, e, r, s) {
                var n,
                    o = this,
                    a = Bt.useAttachEvent ? d({}, e) : e,
                    h = r,
                    p = this.addPointer(t);
                if (
                    ((this.holdTimers[p] = setTimeout(function () {
                        o.pointerHold(Bt.useAttachEvent ? a : t, a, r, s);
                    }, Ot._holdDuration)),
                    (this.pointerIsDown = !0),
                    this.inertiaStatus.active && this.target.selector)
                )
                    for (; i(h); ) {
                        if (
                            h === this.element &&
                            it(
                                this.target.getAction(t, e, this, this.element),
                                this.target
                            ).name === this.prepared.name
                        )
                            return (
                                jt(this.inertiaStatus.i),
                                (this.inertiaStatus.active = !1),
                                void this.collectEventTargets(t, e, r, "down")
                            );
                        h = F(h);
                    }
                if (this.interacting())
                    this.collectEventTargets(t, e, r, "down");
                else {
                    for (
                        this.setEventXY(this.curCoords, [t]),
                            this.downEvent = e;
                        i(h) && !n;

                    )
                        (this.matches = []),
                            (this.matchElements = []),
                            Ct.forEachSelector(function (t, e, i) {
                                var s = vt ? i.querySelectorAll(e) : void 0;
                                N(t, h) &&
                                    !q(t, h, r) &&
                                    H(t, h, r) &&
                                    dt(h, e, s) &&
                                    (o.matches.push(t),
                                    o.matchElements.push(h));
                            }),
                            (n = this.validateSelector(
                                t,
                                e,
                                this.matches,
                                this.matchElements
                            )),
                            (h = F(h));
                    if (n)
                        return (
                            (this.prepared.name = n.name),
                            (this.prepared.axis = n.axis),
                            (this.prepared.edges = n.edges),
                            this.collectEventTargets(t, e, r, "down"),
                            this.pointerDown(t, e, r, s, n)
                        );
                    (this.downTimes[p] = new Date().getTime()),
                        (this.downTargets[p] = r),
                        u(this.downPointer, t),
                        g(this.prevCoords, this.curCoords),
                        (this.pointerWasMoved = !1),
                        this.collectEventTargets(t, e, r, "down");
                }
            },
            pointerDown: function (t, e, i, r, s) {
                if (
                    s ||
                    this.inertiaStatus.active ||
                    !this.pointerWasMoved ||
                    !this.prepared.name
                ) {
                    (this.pointerIsDown = !0), (this.downEvent = e);
                    var n,
                        o = this.addPointer(t);
                    if (
                        this.pointerIds.length > 1 &&
                        this.target._element === this.element
                    ) {
                        var a = it(
                            s ||
                                this.target.getAction(t, e, this, this.element),
                            this.target
                        );
                        G(this.target, this.element, a) && (n = a),
                            (this.prepared.name = null);
                    } else if (!this.prepared.name) {
                        var h = Ct.get(r);
                        h &&
                            !q(h, r, i) &&
                            H(h, r, i) &&
                            (n = it(s || h.getAction(t, e, this, r), h)) &&
                            G(h, r, n) &&
                            ((this.target = h), (this.element = r));
                    }
                    var p = this.target,
                        l = p && p.options;
                    if (!p || (!s && this.prepared.name))
                        this.inertiaStatus.active &&
                            r === this.element &&
                            it(p.getAction(t, e, this, this.element), p)
                                .name === this.prepared.name &&
                            (jt(this.inertiaStatus.i),
                            (this.inertiaStatus.active = !1),
                            this.checkAndPreventDefault(e, p, this.element));
                    else {
                        if (
                            ((n =
                                n ||
                                it(
                                    s || p.getAction(t, e, this, r),
                                    p,
                                    this.element
                                )),
                            this.setEventXY(this.startCoords, this.pointers),
                            !n)
                        )
                            return;
                        l.styleCursor &&
                            (p._doc.documentElement.style.cursor = Z(n)),
                            (this.resizeAxes =
                                "resize" === n.name ? n.axis : null),
                            "gesture" === n &&
                                this.pointerIds.length < 2 &&
                                (n = null),
                            (this.prepared.name = n.name),
                            (this.prepared.axis = n.axis),
                            (this.prepared.edges = n.edges),
                            (this.snapStatus.snappedX =
                                this.snapStatus.snappedY =
                                this.restrictStatus.restrictedX =
                                this.restrictStatus.restrictedY =
                                    NaN),
                            (this.downTimes[o] = new Date().getTime()),
                            (this.downTargets[o] = i),
                            u(this.downPointer, t),
                            g(this.prevCoords, this.startCoords),
                            (this.pointerWasMoved = !1),
                            this.checkAndPreventDefault(e, p, this.element);
                    }
                } else
                    this.checkAndPreventDefault(e, this.target, this.element);
            },
            setModifications: function (t, e) {
                var i = this.target,
                    r = !0,
                    s =
                        U(i, this.prepared.name) &&
                        (!i.options[this.prepared.name].snap.endOnly || e),
                    n =
                        V(i, this.prepared.name) &&
                        (!i.options[this.prepared.name].restrict.endOnly || e);
                return (
                    s ? this.setSnapping(t) : (this.snapStatus.locked = !1),
                    n
                        ? this.setRestriction(t)
                        : (this.restrictStatus.restricted = !1),
                    s && this.snapStatus.locked && !this.snapStatus.changed
                        ? (r =
                              n &&
                              this.restrictStatus.restricted &&
                              this.restrictStatus.changed)
                        : n &&
                          this.restrictStatus.restricted &&
                          !this.restrictStatus.changed &&
                          (r = !1),
                    r
                );
            },
            setStartOffsets: function (t, e, i) {
                var r,
                    s,
                    n = e.getRect(i),
                    o = _(e, i),
                    a = e.options[this.prepared.name].snap,
                    h = e.options[this.prepared.name].restrict;
                n
                    ? ((this.startOffset.left =
                          this.startCoords.page.x - n.left),
                      (this.startOffset.top = this.startCoords.page.y - n.top),
                      (this.startOffset.right =
                          n.right - this.startCoords.page.x),
                      (this.startOffset.bottom =
                          n.bottom - this.startCoords.page.y),
                      (r = "width" in n ? n.width : n.right - n.left),
                      (s = "height" in n ? n.height : n.bottom - n.top))
                    : (this.startOffset.left =
                          this.startOffset.top =
                          this.startOffset.right =
                          this.startOffset.bottom =
                              0),
                    this.snapOffsets.splice(0);
                var p =
                    a && "startCoords" === a.offset
                        ? {
                              x: this.startCoords.page.x - o.x,
                              y: this.startCoords.page.y - o.y,
                          }
                        : (a && a.offset) || { x: 0, y: 0 };
                if (n && a && a.relativePoints && a.relativePoints.length)
                    for (var l = 0; l < a.relativePoints.length; l++)
                        this.snapOffsets.push({
                            x:
                                this.startOffset.left -
                                r * a.relativePoints[l].x +
                                p.x,
                            y:
                                this.startOffset.top -
                                s * a.relativePoints[l].y +
                                p.y,
                        });
                else this.snapOffsets.push(p);
                n && h.elementRect
                    ? ((this.restrictOffset.left =
                          this.startOffset.left - r * h.elementRect.left),
                      (this.restrictOffset.top =
                          this.startOffset.top - s * h.elementRect.top),
                      (this.restrictOffset.right =
                          this.startOffset.right -
                          r * (1 - h.elementRect.right)),
                      (this.restrictOffset.bottom =
                          this.startOffset.bottom -
                          s * (1 - h.elementRect.bottom)))
                    : (this.restrictOffset.left =
                          this.restrictOffset.top =
                          this.restrictOffset.right =
                          this.restrictOffset.bottom =
                              0);
            },
            start: function (t, e, i) {
                this.interacting() ||
                    !this.pointerIsDown ||
                    this.pointerIds.length < ("gesture" === t.name ? 2 : 1) ||
                    (-1 === lt(Mt, this) && Mt.push(this),
                    this.prepared.name ||
                        this.setEventXY(this.startCoords, this.pointers),
                    (this.prepared.name = t.name),
                    (this.prepared.axis = t.axis),
                    (this.prepared.edges = t.edges),
                    (this.target = e),
                    (this.element = i),
                    this.setStartOffsets(t.name, e, i),
                    this.setModifications(this.startCoords.page),
                    (this.prevEvent = this[this.prepared.name + "Start"](
                        this.downEvent
                    )));
            },
            pointerMove: function (t, e, r, s, n) {
                if (this.inertiaStatus.active) {
                    var o = this.inertiaStatus.upCoords.page,
                        a = this.inertiaStatus.upCoords.client,
                        h = {
                            pageX: o.x + this.inertiaStatus.sx,
                            pageY: o.y + this.inertiaStatus.sy,
                            clientX: a.x + this.inertiaStatus.sx,
                            clientY: a.y + this.inertiaStatus.sy,
                        };
                    this.setEventXY(this.curCoords, [h]);
                } else
                    this.recordPointer(t),
                        this.setEventXY(this.curCoords, this.pointers);
                var p,
                    l,
                    c =
                        this.curCoords.page.x === this.prevCoords.page.x &&
                        this.curCoords.page.y === this.prevCoords.page.y &&
                        this.curCoords.client.x === this.prevCoords.client.x &&
                        this.curCoords.client.y === this.prevCoords.client.y,
                    d = this.mouse ? 0 : lt(this.pointerIds, b(t));
                if (
                    (this.pointerIsDown &&
                        !this.pointerWasMoved &&
                        ((p =
                            this.curCoords.client.x -
                            this.startCoords.client.x),
                        (l =
                            this.curCoords.client.y -
                            this.startCoords.client.y),
                        (this.pointerWasMoved = zt(p, l) > Rt)),
                    c ||
                        (this.pointerIsDown && !this.pointerWasMoved) ||
                        (this.pointerIsDown && clearTimeout(this.holdTimers[d]),
                        this.collectEventTargets(t, e, r, "move")),
                    this.pointerIsDown)
                )
                    if (c && this.pointerWasMoved && !n)
                        this.checkAndPreventDefault(
                            e,
                            this.target,
                            this.element
                        );
                    else if (
                        (m(this.pointerDelta, this.prevCoords, this.curCoords),
                        this.prepared.name)
                    ) {
                        if (
                            this.pointerWasMoved &&
                            (!this.inertiaStatus.active ||
                                (t instanceof J && /inertiastart/.test(t.type)))
                        ) {
                            if (
                                !this.interacting() &&
                                (m(
                                    this.pointerDelta,
                                    this.prevCoords,
                                    this.curCoords
                                ),
                                "drag" === this.prepared.name)
                            ) {
                                var u = Math.abs(p),
                                    v = Math.abs(l),
                                    f = this.target.options.drag.axis,
                                    y = u > v ? "x" : u < v ? "y" : "xy";
                                if ("xy" !== y && "xy" !== f && f !== y) {
                                    this.prepared.name = null;
                                    for (var x = r; i(x); ) {
                                        var E = Ct.get(x);
                                        if (
                                            E &&
                                            E !== this.target &&
                                            !E.options.drag.manualStart &&
                                            "drag" ===
                                                E.getAction(
                                                    this.downPointer,
                                                    this.downEvent,
                                                    this,
                                                    x
                                                ).name &&
                                            W(y, E)
                                        ) {
                                            (this.prepared.name = "drag"),
                                                (this.target = E),
                                                (this.element = x);
                                            break;
                                        }
                                        x = F(x);
                                    }
                                    if (!this.prepared.name) {
                                        var S = this;
                                        for (x = r; i(x); ) {
                                            var w = Ct.forEachSelector(
                                                function (t, e, i) {
                                                    var s = vt
                                                        ? i.querySelectorAll(e)
                                                        : void 0;
                                                    if (t !== S.target)
                                                        return N(t, r) &&
                                                            !t.options.drag
                                                                .manualStart &&
                                                            !q(t, x, r) &&
                                                            H(t, x, r) &&
                                                            dt(x, e, s) &&
                                                            "drag" ===
                                                                t.getAction(
                                                                    S.downPointer,
                                                                    S.downEvent,
                                                                    S,
                                                                    x
                                                                ).name &&
                                                            W(y, t) &&
                                                            G(t, x, "drag")
                                                            ? t
                                                            : void 0;
                                                }
                                            );
                                            if (w) {
                                                (this.prepared.name = "drag"),
                                                    (this.target = w),
                                                    (this.element = x);
                                                break;
                                            }
                                            x = F(x);
                                        }
                                    }
                                }
                            }
                            var z = !!this.prepared.name && !this.interacting();
                            if (
                                z &&
                                (this.target.options[this.prepared.name]
                                    .manualStart ||
                                    !G(
                                        this.target,
                                        this.element,
                                        this.prepared
                                    ))
                            )
                                return void this.stop(e);
                            this.prepared.name &&
                                this.target &&
                                (z &&
                                    this.start(
                                        this.prepared,
                                        this.target,
                                        this.element
                                    ),
                                (this.setModifications(
                                    this.curCoords.page,
                                    n
                                ) ||
                                    z) &&
                                    (this.prevEvent =
                                        this[this.prepared.name + "Move"](e)),
                                this.checkAndPreventDefault(
                                    e,
                                    this.target,
                                    this.element
                                ));
                        }
                        g(this.prevCoords, this.curCoords),
                            (this.dragging || this.resizing) &&
                                this.autoScrollMove(t);
                    }
            },
            dragStart: function (t) {
                var e = new J(this, t, "drag", "start", this.element);
                (this.dragging = !0),
                    this.target.fire(e),
                    (this.activeDrops.dropzones = []),
                    (this.activeDrops.elements = []),
                    (this.activeDrops.rects = []),
                    this.dynamicDrop || this.setActiveDrops(this.element);
                var i = this.getDropEvents(t, e);
                return i.activate && this.fireActiveDrops(i.activate), e;
            },
            dragMove: function (t) {
                var e = this.target,
                    i = new J(this, t, "drag", "move", this.element),
                    r = this.element,
                    s = this.getDrop(i, t, r);
                (this.dropTarget = s.dropzone), (this.dropElement = s.element);
                var n = this.getDropEvents(t, i);
                return (
                    e.fire(i),
                    n.leave && this.prevDropTarget.fire(n.leave),
                    n.enter && this.dropTarget.fire(n.enter),
                    n.move && this.dropTarget.fire(n.move),
                    (this.prevDropTarget = this.dropTarget),
                    (this.prevDropElement = this.dropElement),
                    i
                );
            },
            resizeStart: function (t) {
                var e = new J(this, t, "resize", "start", this.element);
                if (this.prepared.edges) {
                    var i = this.target.getRect(this.element);
                    if (
                        this.target.options.resize.square ||
                        this.target.options.resize.preserveAspectRatio
                    ) {
                        var r = d({}, this.prepared.edges);
                        (r.top = r.top || (r.left && !r.bottom)),
                            (r.left = r.left || (r.top && !r.right)),
                            (r.bottom = r.bottom || (r.right && !r.top)),
                            (r.right = r.right || (r.bottom && !r.left)),
                            (this.prepared._linkedEdges = r);
                    } else this.prepared._linkedEdges = null;
                    this.target.options.resize.preserveAspectRatio &&
                        (this.resizeStartAspectRatio = i.width / i.height),
                        (this.resizeRects = {
                            start: i,
                            current: d({}, i),
                            restricted: d({}, i),
                            previous: d({}, i),
                            delta: {
                                left: 0,
                                right: 0,
                                width: 0,
                                top: 0,
                                bottom: 0,
                                height: 0,
                            },
                        }),
                        (e.rect = this.resizeRects.restricted),
                        (e.deltaRect = this.resizeRects.delta);
                }
                return this.target.fire(e), (this.resizing = !0), e;
            },
            resizeMove: function (t) {
                var e = new J(this, t, "resize", "move", this.element),
                    i = this.prepared.edges,
                    r = this.target.options.resize.invert,
                    s = "reposition" === r || "negate" === r;
                if (i) {
                    var n = e.dx,
                        o = e.dy,
                        a = this.resizeRects.start,
                        h = this.resizeRects.current,
                        p = this.resizeRects.restricted,
                        l = this.resizeRects.delta,
                        c = d(this.resizeRects.previous, p),
                        u = i;
                    if (this.target.options.resize.preserveAspectRatio) {
                        var g = this.resizeStartAspectRatio;
                        (i = this.prepared._linkedEdges),
                            (u.left && u.bottom) || (u.right && u.top)
                                ? (o = -n / g)
                                : u.left || u.right
                                ? (o = n / g)
                                : (u.top || u.bottom) && (n = o * g);
                    } else
                        this.target.options.resize.square &&
                            ((i = this.prepared._linkedEdges),
                            (u.left && u.bottom) || (u.right && u.top)
                                ? (o = -n)
                                : u.left || u.right
                                ? (o = n)
                                : (u.top || u.bottom) && (n = o));
                    if (
                        (i.top && (h.top += o),
                        i.bottom && (h.bottom += o),
                        i.left && (h.left += n),
                        i.right && (h.right += n),
                        s)
                    ) {
                        if ((d(p, h), "reposition" === r)) {
                            var v;
                            p.top > p.bottom &&
                                ((v = p.top),
                                (p.top = p.bottom),
                                (p.bottom = v)),
                                p.left > p.right &&
                                    ((v = p.left),
                                    (p.left = p.right),
                                    (p.right = v));
                        }
                    } else
                        (p.top = Math.min(h.top, a.bottom)),
                            (p.bottom = Math.max(h.bottom, a.top)),
                            (p.left = Math.min(h.left, a.right)),
                            (p.right = Math.max(h.right, a.left));
                    (p.width = p.right - p.left), (p.height = p.bottom - p.top);
                    for (var m in p) l[m] = p[m] - c[m];
                    (e.edges = this.prepared.edges),
                        (e.rect = p),
                        (e.deltaRect = l);
                }
                return this.target.fire(e), e;
            },
            gestureStart: function (t) {
                var e = new J(this, t, "gesture", "start", this.element);
                return (
                    (e.ds = 0),
                    (this.gesture.startDistance = this.gesture.prevDistance =
                        e.distance),
                    (this.gesture.startAngle = this.gesture.prevAngle =
                        e.angle),
                    (this.gesture.scale = 1),
                    (this.gesturing = !0),
                    this.target.fire(e),
                    e
                );
            },
            gestureMove: function (t) {
                if (!this.pointerIds.length) return this.prevEvent;
                var e;
                return (
                    (e = new J(this, t, "gesture", "move", this.element)),
                    (e.ds = e.scale - this.gesture.scale),
                    this.target.fire(e),
                    (this.gesture.prevAngle = e.angle),
                    (this.gesture.prevDistance = e.distance),
                    e.scale === 1 / 0 ||
                        null === e.scale ||
                        void 0 === e.scale ||
                        isNaN(e.scale) ||
                        (this.gesture.scale = e.scale),
                    e
                );
            },
            pointerHold: function (t, e, i) {
                this.collectEventTargets(t, e, i, "hold");
            },
            pointerUp: function (t, e, i, r) {
                var s = this.mouse ? 0 : lt(this.pointerIds, b(t));
                clearTimeout(this.holdTimers[s]),
                    this.collectEventTargets(t, e, i, "up"),
                    this.collectEventTargets(t, e, i, "tap"),
                    this.pointerEnd(t, e, i, r),
                    this.removePointer(t);
            },
            pointerCancel: function (t, e, i, r) {
                var s = this.mouse ? 0 : lt(this.pointerIds, b(t));
                clearTimeout(this.holdTimers[s]),
                    this.collectEventTargets(t, e, i, "cancel"),
                    this.pointerEnd(t, e, i, r),
                    this.removePointer(t);
            },
            ie8Dblclick: function (t, e, i) {
                this.prevTap &&
                    e.clientX === this.prevTap.clientX &&
                    e.clientY === this.prevTap.clientY &&
                    i === this.prevTap.target &&
                    ((this.downTargets[0] = i),
                    (this.downTimes[0] = new Date().getTime()),
                    this.collectEventTargets(t, e, i, "tap"));
            },
            pointerEnd: function (t, e, i, r) {
                var s,
                    n = this.target,
                    o = n && n.options,
                    a =
                        o &&
                        this.prepared.name &&
                        o[this.prepared.name].inertia,
                    h = this.inertiaStatus;
                if (this.interacting()) {
                    if (h.active && !h.ending) return;
                    var p,
                        l = new Date().getTime(),
                        c = !1,
                        u = !1,
                        v = !1,
                        m =
                            U(n, this.prepared.name) &&
                            o[this.prepared.name].snap.endOnly,
                        f =
                            V(n, this.prepared.name) &&
                            o[this.prepared.name].restrict.endOnly,
                        y = 0,
                        x = 0;
                    if (
                        ((p = this.dragging
                            ? "x" === o.drag.axis
                                ? Math.abs(this.pointerDelta.client.vx)
                                : "y" === o.drag.axis
                                ? Math.abs(this.pointerDelta.client.vy)
                                : this.pointerDelta.client.speed
                            : this.pointerDelta.client.speed),
                        (c =
                            a &&
                            a.enabled &&
                            "gesture" !== this.prepared.name &&
                            e !== h.startEvent),
                        (u =
                            c &&
                            l - this.curCoords.timeStamp < 50 &&
                            p > a.minSpeed &&
                            p > a.endSpeed),
                        c && !u && (m || f))
                    ) {
                        var E = {};
                        (E.snap = E.restrict = E),
                            m &&
                                (this.setSnapping(this.curCoords.page, E),
                                E.locked && ((y += E.dx), (x += E.dy))),
                            f &&
                                (this.setRestriction(this.curCoords.page, E),
                                E.restricted && ((y += E.dx), (x += E.dy))),
                            (y || x) && (v = !0);
                    }
                    if (u || v) {
                        if (
                            (g(h.upCoords, this.curCoords),
                            (this.pointers[0] = h.startEvent =
                                new J(
                                    this,
                                    e,
                                    this.prepared.name,
                                    "inertiastart",
                                    this.element
                                )),
                            (h.t0 = l),
                            n.fire(h.startEvent),
                            u)
                        ) {
                            (h.vx0 = this.pointerDelta.client.vx),
                                (h.vy0 = this.pointerDelta.client.vy),
                                (h.v0 = p),
                                this.calcInertia(h);
                            var S,
                                b = d({}, this.curCoords.page),
                                w = _(n, this.element);
                            if (
                                ((b.x = b.x + h.xe - w.x),
                                (b.y = b.y + h.ye - w.y),
                                (S = {
                                    useStatusXY: !0,
                                    x: b.x,
                                    y: b.y,
                                    dx: 0,
                                    dy: 0,
                                    snap: null,
                                }),
                                (S.snap = S),
                                (y = x = 0),
                                m)
                            ) {
                                var z = this.setSnapping(
                                    this.curCoords.page,
                                    S
                                );
                                z.locked && ((y += z.dx), (x += z.dy));
                            }
                            if (f) {
                                var D = this.setRestriction(
                                    this.curCoords.page,
                                    S
                                );
                                D.restricted && ((y += D.dx), (x += D.dy));
                            }
                            (h.modifiedXe += y),
                                (h.modifiedYe += x),
                                (h.i = Lt(this.boundInertiaFrame));
                        } else
                            (h.smoothEnd = !0),
                                (h.xe = y),
                                (h.ye = x),
                                (h.sx = h.sy = 0),
                                (h.i = Lt(this.boundSmoothEndFrame));
                        return void (h.active = !0);
                    }
                    (m || f) && this.pointerMove(t, e, i, r, !0);
                }
                if (this.dragging) {
                    s = new J(this, e, "drag", "end", this.element);
                    var T = this.element,
                        C = this.getDrop(s, e, T);
                    (this.dropTarget = C.dropzone),
                        (this.dropElement = C.element);
                    var M = this.getDropEvents(e, s);
                    M.leave && this.prevDropTarget.fire(M.leave),
                        M.enter && this.dropTarget.fire(M.enter),
                        M.drop && this.dropTarget.fire(M.drop),
                        M.deactivate && this.fireActiveDrops(M.deactivate),
                        n.fire(s);
                } else
                    this.resizing
                        ? ((s = new J(this, e, "resize", "end", this.element)),
                          n.fire(s))
                        : this.gesturing &&
                          ((s = new J(this, e, "gesture", "end", this.element)),
                          n.fire(s));
                this.stop(e);
            },
            collectDrops: function (t) {
                var e,
                    r = [],
                    s = [];
                for (t = t || this.element, e = 0; e < Ct.length; e++)
                    if (Ct[e].options.drop.enabled) {
                        var n = Ct[e],
                            o = n.options.drop.accept;
                        if (!((i(o) && o !== t) || (l(o) && !dt(t, o))))
                            for (
                                var a = n.selector
                                        ? n._context.querySelectorAll(
                                              n.selector
                                          )
                                        : [n._element],
                                    h = 0,
                                    p = a.length;
                                h < p;
                                h++
                            ) {
                                var c = a[h];
                                c !== t && (r.push(n), s.push(c));
                            }
                    }
                return { dropzones: r, elements: s };
            },
            fireActiveDrops: function (t) {
                var e, i, r, s;
                for (e = 0; e < this.activeDrops.dropzones.length; e++)
                    (i = this.activeDrops.dropzones[e]),
                        (r = this.activeDrops.elements[e]) !== s &&
                            ((t.target = r), i.fire(t)),
                        (s = r);
            },
            setActiveDrops: function (t) {
                var e = this.collectDrops(t, !0);
                (this.activeDrops.dropzones = e.dropzones),
                    (this.activeDrops.elements = e.elements),
                    (this.activeDrops.rects = []);
                for (var i = 0; i < this.activeDrops.dropzones.length; i++)
                    this.activeDrops.rects[i] = this.activeDrops.dropzones[
                        i
                    ].getRect(this.activeDrops.elements[i]);
            },
            getDrop: function (t, e, i) {
                var r = [];
                Pt && this.setActiveDrops(i);
                for (var s = 0; s < this.activeDrops.dropzones.length; s++) {
                    var n = this.activeDrops.dropzones[s],
                        o = this.activeDrops.elements[s],
                        a = this.activeDrops.rects[s];
                    r.push(n.dropCheck(t, e, this.target, i, o, a) ? o : null);
                }
                var h = L(r);
                return {
                    dropzone: this.activeDrops.dropzones[h] || null,
                    element: this.activeDrops.elements[h] || null,
                };
            },
            getDropEvents: function (t, e) {
                var i = {
                    enter: null,
                    leave: null,
                    activate: null,
                    deactivate: null,
                    move: null,
                    drop: null,
                };
                return (
                    this.dropElement !== this.prevDropElement &&
                        (this.prevDropTarget &&
                            ((i.leave = {
                                target: this.prevDropElement,
                                dropzone: this.prevDropTarget,
                                relatedTarget: e.target,
                                draggable: e.interactable,
                                dragEvent: e,
                                interaction: this,
                                timeStamp: e.timeStamp,
                                type: "dragleave",
                            }),
                            (e.dragLeave = this.prevDropElement),
                            (e.prevDropzone = this.prevDropTarget)),
                        this.dropTarget &&
                            ((i.enter = {
                                target: this.dropElement,
                                dropzone: this.dropTarget,
                                relatedTarget: e.target,
                                draggable: e.interactable,
                                dragEvent: e,
                                interaction: this,
                                timeStamp: e.timeStamp,
                                type: "dragenter",
                            }),
                            (e.dragEnter = this.dropElement),
                            (e.dropzone = this.dropTarget))),
                    "dragend" === e.type &&
                        this.dropTarget &&
                        ((i.drop = {
                            target: this.dropElement,
                            dropzone: this.dropTarget,
                            relatedTarget: e.target,
                            draggable: e.interactable,
                            dragEvent: e,
                            interaction: this,
                            timeStamp: e.timeStamp,
                            type: "drop",
                        }),
                        (e.dropzone = this.dropTarget)),
                    "dragstart" === e.type &&
                        (i.activate = {
                            target: null,
                            dropzone: null,
                            relatedTarget: e.target,
                            draggable: e.interactable,
                            dragEvent: e,
                            interaction: this,
                            timeStamp: e.timeStamp,
                            type: "dropactivate",
                        }),
                    "dragend" === e.type &&
                        (i.deactivate = {
                            target: null,
                            dropzone: null,
                            relatedTarget: e.target,
                            draggable: e.interactable,
                            dragEvent: e,
                            interaction: this,
                            timeStamp: e.timeStamp,
                            type: "dropdeactivate",
                        }),
                    "dragmove" === e.type &&
                        this.dropTarget &&
                        ((i.move = {
                            target: this.dropElement,
                            dropzone: this.dropTarget,
                            relatedTarget: e.target,
                            draggable: e.interactable,
                            dragEvent: e,
                            interaction: this,
                            dragmove: e,
                            timeStamp: e.timeStamp,
                            type: "dropmove",
                        }),
                        (e.dropzone = this.dropTarget)),
                    i
                );
            },
            currentAction: function () {
                return (
                    (this.dragging && "drag") ||
                    (this.resizing && "resize") ||
                    (this.gesturing && "gesture") ||
                    null
                );
            },
            interacting: function () {
                return this.dragging || this.resizing || this.gesturing;
            },
            clearTargets: function () {
                (this.target = this.element = null),
                    (this.dropTarget =
                        this.dropElement =
                        this.prevDropTarget =
                        this.prevDropElement =
                            null);
            },
            stop: function (t) {
                if (this.interacting()) {
                    _t.stop(), (this.matches = []), (this.matchElements = []);
                    var e = this.target;
                    e.options.styleCursor &&
                        (e._doc.documentElement.style.cursor = ""),
                        t &&
                            a(t.preventDefault) &&
                            this.checkAndPreventDefault(t, e, this.element),
                        this.dragging &&
                            (this.activeDrops.dropzones =
                                this.activeDrops.elements =
                                this.activeDrops.rects =
                                    null);
                }
                this.clearTargets(),
                    (this.pointerIsDown =
                        this.snapStatus.locked =
                        this.dragging =
                        this.resizing =
                        this.gesturing =
                            !1),
                    (this.prepared.name = this.prevEvent = null),
                    (this.inertiaStatus.resumeDx = this.inertiaStatus.resumeDy =
                        0);
                for (var i = 0; i < this.pointers.length; i++)
                    -1 === lt(this.pointerIds, b(this.pointers[i])) &&
                        this.pointers.splice(i, 1);
            },
            inertiaFrame: function () {
                var t = this.inertiaStatus,
                    e =
                        this.target.options[this.prepared.name].inertia
                            .resistance,
                    i = new Date().getTime() / 1e3 - t.t0;
                if (i < t.te) {
                    var r = 1 - (Math.exp(-e * i) - t.lambda_v0) / t.one_ve_v0;
                    if (t.modifiedXe === t.xe && t.modifiedYe === t.ye)
                        (t.sx = t.xe * r), (t.sy = t.ye * r);
                    else {
                        var s = X(
                            0,
                            0,
                            t.xe,
                            t.ye,
                            t.modifiedXe,
                            t.modifiedYe,
                            r
                        );
                        (t.sx = s.x), (t.sy = s.y);
                    }
                    this.pointerMove(t.startEvent, t.startEvent),
                        (t.i = Lt(this.boundInertiaFrame));
                } else
                    (t.ending = !0),
                        (t.sx = t.modifiedXe),
                        (t.sy = t.modifiedYe),
                        this.pointerMove(t.startEvent, t.startEvent),
                        this.pointerEnd(t.startEvent, t.startEvent),
                        (t.active = t.ending = !1);
            },
            smoothEndFrame: function () {
                var t = this.inertiaStatus,
                    e = new Date().getTime() - t.t0,
                    i =
                        this.target.options[this.prepared.name].inertia
                            .smoothEndDuration;
                e < i
                    ? ((t.sx = Y(e, 0, t.xe, i)),
                      (t.sy = Y(e, 0, t.ye, i)),
                      this.pointerMove(t.startEvent, t.startEvent),
                      (t.i = Lt(this.boundSmoothEndFrame)))
                    : ((t.ending = !0),
                      (t.sx = t.xe),
                      (t.sy = t.ye),
                      this.pointerMove(t.startEvent, t.startEvent),
                      this.pointerEnd(t.startEvent, t.startEvent),
                      (t.smoothEnd = t.active = t.ending = !1));
            },
            addPointer: function (t) {
                var e = b(t),
                    i = this.mouse ? 0 : lt(this.pointerIds, e);
                return (
                    -1 === i && (i = this.pointerIds.length),
                    (this.pointerIds[i] = e),
                    (this.pointers[i] = t),
                    i
                );
            },
            removePointer: function (t) {
                var e = b(t),
                    i = this.mouse ? 0 : lt(this.pointerIds, e);
                -1 !== i &&
                    (this.pointers.splice(i, 1),
                    this.pointerIds.splice(i, 1),
                    this.downTargets.splice(i, 1),
                    this.downTimes.splice(i, 1),
                    this.holdTimers.splice(i, 1));
            },
            recordPointer: function (t) {
                var e = this.mouse ? 0 : lt(this.pointerIds, b(t));
                -1 !== e && (this.pointers[e] = t);
            },
            collectEventTargets: function (t, e, r, s) {
                var n = this.mouse ? 0 : lt(this.pointerIds, b(t));
                if (
                    "tap" !== s ||
                    (!this.pointerWasMoved &&
                        this.downTargets[n] &&
                        this.downTargets[n] === r)
                ) {
                    for (var o = [], a = [], h = r; h; )
                        nt.isSet(h) &&
                            nt(h)._iEvents[s] &&
                            (o.push(nt(h)), a.push(h)),
                            Ct.forEachSelector(function (t, e, n) {
                                var p = vt ? n.querySelectorAll(e) : void 0;
                                t._iEvents[s] &&
                                    i(h) &&
                                    N(t, h) &&
                                    !q(t, h, r) &&
                                    H(t, h, r) &&
                                    dt(h, e, p) &&
                                    (o.push(t), a.push(h));
                            }),
                            (h = F(h));
                    (o.length || "tap" === s) &&
                        this.firePointers(t, e, r, o, a, s);
                }
            },
            firePointers: function (t, e, i, r, s, n) {
                var o,
                    a,
                    h,
                    p = this.mouse ? 0 : lt(this.pointerIds, b(t)),
                    c = {};
                for (
                    "doubletap" === n
                        ? (c = t)
                        : (u(c, e),
                          e !== t && u(c, t),
                          (c.preventDefault = Q),
                          (c.stopPropagation = J.prototype.stopPropagation),
                          (c.stopImmediatePropagation =
                              J.prototype.stopImmediatePropagation),
                          (c.interaction = this),
                          (c.timeStamp = new Date().getTime()),
                          (c.originalEvent = e),
                          (c.originalPointer = t),
                          (c.type = n),
                          (c.pointerId = b(t)),
                          (c.pointerType = this.mouse
                              ? "mouse"
                              : Xt
                              ? l(t.pointerType)
                                  ? t.pointerType
                                  : [, , "touch", "pen", "mouse"][t.pointerType]
                              : "touch")),
                        "tap" === n &&
                            ((c.dt = c.timeStamp - this.downTimes[p]),
                            (a = c.timeStamp - this.tapTime),
                            (h = !!(
                                this.prevTap &&
                                "doubletap" !== this.prevTap.type &&
                                this.prevTap.target === c.target &&
                                a < 500
                            )),
                            (c.double = h),
                            (this.tapTime = c.timeStamp)),
                        o = 0;
                    o < r.length &&
                    ((c.currentTarget = s[o]),
                    (c.interactable = r[o]),
                    r[o].fire(c),
                    !(
                        c.immediatePropagationStopped ||
                        (c.propagationStopped && s[o + 1] !== c.currentTarget)
                    ));
                    o++
                );
                if (h) {
                    var g = {};
                    d(g, c),
                        (g.dt = a),
                        (g.type = "doubletap"),
                        this.collectEventTargets(g, e, i, "doubletap"),
                        (this.prevTap = g);
                } else "tap" === n && (this.prevTap = c);
            },
            validateSelector: function (t, e, i, r) {
                for (var s = 0, n = i.length; s < n; s++) {
                    var o = i[s],
                        a = r[s],
                        h = it(o.getAction(t, e, this, a), o);
                    if (h && G(o, a, h))
                        return (this.target = o), (this.element = a), h;
                }
            },
            setSnapping: function (t, e) {
                var i,
                    r,
                    s,
                    n = this.target.options[this.prepared.name].snap,
                    o = [];
                if ((e = e || this.snapStatus).useStatusXY)
                    r = { x: e.x, y: e.y };
                else {
                    var p = _(this.target, this.element);
                    ((r = d({}, t)).x -= p.x), (r.y -= p.y);
                }
                (e.realX = r.x),
                    (e.realY = r.y),
                    (r.x = r.x - this.inertiaStatus.resumeDx),
                    (r.y = r.y - this.inertiaStatus.resumeDy);
                for (
                    var l = n.targets ? n.targets.length : 0, c = 0;
                    c < this.snapOffsets.length;
                    c++
                ) {
                    var u = {
                        x: r.x - this.snapOffsets[c].x,
                        y: r.y - this.snapOffsets[c].y,
                    };
                    for (s = 0; s < l; s++)
                        (i = a(n.targets[s])
                            ? n.targets[s](u.x, u.y, this)
                            : n.targets[s]) &&
                            o.push({
                                x: h(i.x) ? i.x + this.snapOffsets[c].x : u.x,
                                y: h(i.y) ? i.y + this.snapOffsets[c].y : u.y,
                                range: h(i.range) ? i.range : n.range,
                            });
                }
                var g = {
                    target: null,
                    inRange: !1,
                    distance: 0,
                    range: 0,
                    dx: 0,
                    dy: 0,
                };
                for (s = 0, l = o.length; s < l; s++) {
                    var v = (i = o[s]).range,
                        m = i.x - r.x,
                        f = i.y - r.y,
                        y = zt(m, f),
                        x = y <= v;
                    v === 1 / 0 && g.inRange && g.range !== 1 / 0 && (x = !1),
                        (g.target &&
                            !(x
                                ? g.inRange && v !== 1 / 0
                                    ? y / v < g.distance / g.range
                                    : (v === 1 / 0 && g.range !== 1 / 0) ||
                                      y < g.distance
                                : !g.inRange && y < g.distance)) ||
                            (v === 1 / 0 && (x = !0),
                            (g.target = i),
                            (g.distance = y),
                            (g.range = v),
                            (g.inRange = x),
                            (g.dx = m),
                            (g.dy = f),
                            (e.range = v));
                }
                var E;
                return (
                    g.target
                        ? ((E =
                              e.snappedX !== g.target.x ||
                              e.snappedY !== g.target.y),
                          (e.snappedX = g.target.x),
                          (e.snappedY = g.target.y))
                        : ((E = !0), (e.snappedX = NaN), (e.snappedY = NaN)),
                    (e.dx = g.dx),
                    (e.dy = g.dy),
                    (e.changed = E || (g.inRange && !e.locked)),
                    (e.locked = g.inRange),
                    e
                );
            },
            setRestriction: function (t, e) {
                var r,
                    s = this.target,
                    n = s && s.options[this.prepared.name].restrict,
                    o = n && n.restriction;
                if (!o) return e;
                (r = r =
                    (e = e || this.restrictStatus).useStatusXY
                        ? { x: e.x, y: e.y }
                        : d({}, t)),
                    e.snap &&
                        e.snap.locked &&
                        ((r.x += e.snap.dx || 0), (r.y += e.snap.dy || 0)),
                    (r.x -= this.inertiaStatus.resumeDx),
                    (r.y -= this.inertiaStatus.resumeDy),
                    (e.dx = 0),
                    (e.dy = 0),
                    (e.restricted = !1);
                var h, p, c;
                return l(o) &&
                    !(o =
                        "parent" === o
                            ? F(this.element)
                            : "self" === o
                            ? s.getRect(this.element)
                            : I(this.element, o))
                    ? e
                    : (a(o) && (o = o(r.x, r.y, this.element)),
                      i(o) && (o = T(o)),
                      (h = o),
                      o
                          ? "x" in o && "y" in o
                              ? ((p = Math.max(
                                    Math.min(
                                        h.x +
                                            h.width -
                                            this.restrictOffset.right,
                                        r.x
                                    ),
                                    h.x + this.restrictOffset.left
                                )),
                                (c = Math.max(
                                    Math.min(
                                        h.y +
                                            h.height -
                                            this.restrictOffset.bottom,
                                        r.y
                                    ),
                                    h.y + this.restrictOffset.top
                                )))
                              : ((p = Math.max(
                                    Math.min(
                                        h.right - this.restrictOffset.right,
                                        r.x
                                    ),
                                    h.left + this.restrictOffset.left
                                )),
                                (c = Math.max(
                                    Math.min(
                                        h.bottom - this.restrictOffset.bottom,
                                        r.y
                                    ),
                                    h.top + this.restrictOffset.top
                                )))
                          : ((p = r.x), (c = r.y)),
                      (e.dx = p - r.x),
                      (e.dy = c - r.y),
                      (e.changed = e.restrictedX !== p || e.restrictedY !== c),
                      (e.restricted = !(!e.dx && !e.dy)),
                      (e.restrictedX = p),
                      (e.restrictedY = c),
                      e);
            },
            checkAndPreventDefault: function (t, e, i) {
                if ((e = e || this.target)) {
                    var r = e.options,
                        s = r.preventDefault;
                    if (
                        "auto" !== s ||
                        !i ||
                        /^(input|select|textarea)$/i.test(t.target.nodeName)
                    )
                        "always" !== s || t.preventDefault();
                    else {
                        if (
                            /down|start/i.test(t.type) &&
                            "drag" === this.prepared.name &&
                            "xy" !== r.drag.axis
                        )
                            return;
                        if (
                            r[this.prepared.name] &&
                            r[this.prepared.name].manualStart &&
                            !this.interacting()
                        )
                            return;
                        t.preventDefault();
                    }
                }
            },
            calcInertia: function (t) {
                var e = this.target.options[this.prepared.name].inertia,
                    i = e.resistance,
                    r = -Math.log(e.endSpeed / t.v0) / i;
                (t.x0 = this.prevEvent.pageX),
                    (t.y0 = this.prevEvent.pageY),
                    (t.t0 = t.startEvent.timeStamp / 1e3),
                    (t.sx = t.sy = 0),
                    (t.modifiedXe = t.xe = (t.vx0 - r) / i),
                    (t.modifiedYe = t.ye = (t.vy0 - r) / i),
                    (t.te = r),
                    (t.lambda_v0 = i / t.v0),
                    (t.one_ve_v0 = 1 - e.endSpeed / t.v0);
            },
            autoScrollMove: function (t) {
                if (this.interacting() && $(this.target, this.prepared.name))
                    if (this.inertiaStatus.active) _t.x = _t.y = 0;
                    else {
                        var e,
                            i,
                            s,
                            n,
                            o =
                                this.target.options[this.prepared.name]
                                    .autoScroll,
                            a = o.container || z(this.element);
                        if (r(a))
                            (n = t.clientX < _t.margin),
                                (e = t.clientY < _t.margin),
                                (i = t.clientX > a.innerWidth - _t.margin),
                                (s = t.clientY > a.innerHeight - _t.margin);
                        else {
                            var h = D(a);
                            (n = t.clientX < h.left + _t.margin),
                                (e = t.clientY < h.top + _t.margin),
                                (i = t.clientX > h.right - _t.margin),
                                (s = t.clientY > h.bottom - _t.margin);
                        }
                        (_t.x = i ? 1 : n ? -1 : 0),
                            (_t.y = s ? 1 : e ? -1 : 0),
                            _t.isScrolling ||
                                ((_t.margin = o.margin),
                                (_t.speed = o.speed),
                                _t.start(this));
                    }
            },
            _updateEventTargets: function (t, e) {
                (this._eventTarget = t), (this._curEventTarget = e);
            },
        }),
            (J.prototype = {
                preventDefault: e,
                stopImmediatePropagation: function () {
                    this.immediatePropagationStopped = this.propagationStopped =
                        !0;
                },
                stopPropagation: function () {
                    this.propagationStopped = !0;
                },
            });
        for (
            var Jt = {},
                Qt = [
                    "dragStart",
                    "dragMove",
                    "resizeStart",
                    "resizeMove",
                    "gestureStart",
                    "gestureMove",
                    "pointerOver",
                    "pointerOut",
                    "pointerHover",
                    "selectorDown",
                    "pointerDown",
                    "pointerMove",
                    "pointerUp",
                    "pointerCancel",
                    "pointerEnd",
                    "addPointer",
                    "removePointer",
                    "recordPointer",
                    "autoScrollMove",
                ],
                Zt = 0,
                te = Qt.length;
            Zt < te;
            Zt++
        ) {
            var ee = Qt[Zt];
            Jt[ee] = K(ee);
        }
        (Ct.indexOfElement = function (t, e) {
            e = e || ft;
            for (var i = 0; i < this.length; i++) {
                var r = this[i];
                if (
                    (r.selector === t && r._context === e) ||
                    (!r.selector && r._element === t)
                )
                    return i;
            }
            return -1;
        }),
            (Ct.get = function (t, e) {
                return this[this.indexOfElement(t, e && e.context)];
            }),
            (Ct.forEachSelector = function (t) {
                for (var e = 0; e < this.length; e++) {
                    var i = this[e];
                    if (i.selector) {
                        var r = t(i, i.selector, i._context, e, this);
                        if (void 0 !== r) return r;
                    }
                }
            }),
            ((ot.prototype = {
                setOnEvents: function (t, e) {
                    return (
                        "drop" === t
                            ? (a(e.ondrop) && (this.ondrop = e.ondrop),
                              a(e.ondropactivate) &&
                                  (this.ondropactivate = e.ondropactivate),
                              a(e.ondropdeactivate) &&
                                  (this.ondropdeactivate = e.ondropdeactivate),
                              a(e.ondragenter) &&
                                  (this.ondragenter = e.ondragenter),
                              a(e.ondragleave) &&
                                  (this.ondragleave = e.ondragleave),
                              a(e.ondropmove) &&
                                  (this.ondropmove = e.ondropmove))
                            : ((t = "on" + t),
                              a(e.onstart) && (this[t + "start"] = e.onstart),
                              a(e.onmove) && (this[t + "move"] = e.onmove),
                              a(e.onend) && (this[t + "end"] = e.onend),
                              a(e.oninertiastart) &&
                                  (this[t + "inertiastart"] =
                                      e.oninertiastart)),
                        this
                    );
                },
                draggable: function (t) {
                    return o(t)
                        ? ((this.options.drag.enabled = !1 !== t.enabled),
                          this.setPerAction("drag", t),
                          this.setOnEvents("drag", t),
                          /^x$|^y$|^xy$/.test(t.axis)
                              ? (this.options.drag.axis = t.axis)
                              : null === t.axis &&
                                delete this.options.drag.axis,
                          this)
                        : p(t)
                        ? ((this.options.drag.enabled = t), this)
                        : this.options.drag;
                },
                setPerAction: function (t, e) {
                    for (var i in e)
                        i in Ot[t] &&
                            (o(e[i])
                                ? ((this.options[t][i] = d(
                                      this.options[t][i] || {},
                                      e[i]
                                  )),
                                  o(Ot.perAction[i]) &&
                                      "enabled" in Ot.perAction[i] &&
                                      (this.options[t][i].enabled =
                                          !1 !== e[i].enabled))
                                : p(e[i]) && o(Ot.perAction[i])
                                ? (this.options[t][i].enabled = e[i])
                                : void 0 !== e[i] &&
                                  (this.options[t][i] = e[i]));
                },
                dropzone: function (t) {
                    return o(t)
                        ? ((this.options.drop.enabled = !1 !== t.enabled),
                          this.setOnEvents("drop", t),
                          /^(pointer|center)$/.test(t.overlap)
                              ? (this.options.drop.overlap = t.overlap)
                              : h(t.overlap) &&
                                (this.options.drop.overlap = Math.max(
                                    Math.min(1, t.overlap),
                                    0
                                )),
                          "accept" in t &&
                              (this.options.drop.accept = t.accept),
                          "checker" in t &&
                              (this.options.drop.checker = t.checker),
                          this)
                        : p(t)
                        ? ((this.options.drop.enabled = t), this)
                        : this.options.drop;
                },
                dropCheck: function (t, e, i, r, s, n) {
                    var o = !1;
                    if (!(n = n || this.getRect(s)))
                        return (
                            !!this.options.drop.checker &&
                            this.options.drop.checker(t, e, o, this, s, i, r)
                        );
                    var a = this.options.drop.overlap;
                    if ("pointer" === a) {
                        var p,
                            l,
                            c = x(t),
                            d = _(i, r);
                        (c.x += d.x),
                            (c.y += d.y),
                            (p = c.x > n.left && c.x < n.right),
                            (l = c.y > n.top && c.y < n.bottom),
                            (o = p && l);
                    }
                    var u = i.getRect(r);
                    if ("center" === a) {
                        var g = u.left + u.width / 2,
                            v = u.top + u.height / 2;
                        o =
                            g >= n.left &&
                            g <= n.right &&
                            v >= n.top &&
                            v <= n.bottom;
                    }
                    return (
                        h(a) &&
                            (o =
                                (Math.max(
                                    0,
                                    Math.min(n.right, u.right) -
                                        Math.max(n.left, u.left)
                                ) *
                                    Math.max(
                                        0,
                                        Math.min(n.bottom, u.bottom) -
                                            Math.max(n.top, u.top)
                                    )) /
                                    (u.width * u.height) >=
                                a),
                        this.options.drop.checker &&
                            (o = this.options.drop.checker(
                                t,
                                e,
                                o,
                                this,
                                s,
                                i,
                                r
                            )),
                        o
                    );
                },
                dropChecker: function (t) {
                    return a(t)
                        ? ((this.options.drop.checker = t), this)
                        : null === t
                        ? (delete this.options.getRect, this)
                        : this.options.drop.checker;
                },
                accept: function (t) {
                    return i(t)
                        ? ((this.options.drop.accept = t), this)
                        : c(t)
                        ? ((this.options.drop.accept = t), this)
                        : null === t
                        ? (delete this.options.drop.accept, this)
                        : this.options.drop.accept;
                },
                resizable: function (t) {
                    return o(t)
                        ? ((this.options.resize.enabled = !1 !== t.enabled),
                          this.setPerAction("resize", t),
                          this.setOnEvents("resize", t),
                          /^x$|^y$|^xy$/.test(t.axis)
                              ? (this.options.resize.axis = t.axis)
                              : null === t.axis &&
                                (this.options.resize.axis = Ot.resize.axis),
                          p(t.preserveAspectRatio)
                              ? (this.options.resize.preserveAspectRatio =
                                    t.preserveAspectRatio)
                              : p(t.square) &&
                                (this.options.resize.square = t.square),
                          this)
                        : p(t)
                        ? ((this.options.resize.enabled = t), this)
                        : this.options.resize;
                },
                squareResize: function (t) {
                    return p(t)
                        ? ((this.options.resize.square = t), this)
                        : null === t
                        ? (delete this.options.resize.square, this)
                        : this.options.resize.square;
                },
                gesturable: function (t) {
                    return o(t)
                        ? ((this.options.gesture.enabled = !1 !== t.enabled),
                          this.setPerAction("gesture", t),
                          this.setOnEvents("gesture", t),
                          this)
                        : p(t)
                        ? ((this.options.gesture.enabled = t), this)
                        : this.options.gesture;
                },
                autoScroll: function (t) {
                    return (
                        o(t)
                            ? (t = d({ actions: ["drag", "resize"] }, t))
                            : p(t) &&
                              (t = { actions: ["drag", "resize"], enabled: t }),
                        this.setOptions("autoScroll", t)
                    );
                },
                snap: function (t) {
                    var e = this.setOptions("snap", t);
                    return e === this ? this : e.drag;
                },
                setOptions: function (t, e) {
                    var i,
                        r = e && n(e.actions) ? e.actions : ["drag"];
                    if (o(e) || p(e)) {
                        for (i = 0; i < r.length; i++) {
                            var s = /resize/.test(r[i]) ? "resize" : r[i];
                            if (o(this.options[s])) {
                                var a = this.options[s][t];
                                o(e)
                                    ? (d(a, e),
                                      (a.enabled = !1 !== e.enabled),
                                      "snap" === t &&
                                          ("grid" === a.mode
                                              ? (a.targets = [
                                                    nt.createSnapGrid(
                                                        d(
                                                            {
                                                                offset: a.gridOffset || {
                                                                    x: 0,
                                                                    y: 0,
                                                                },
                                                            },
                                                            a.grid || {}
                                                        )
                                                    ),
                                                ])
                                              : "anchor" === a.mode
                                              ? (a.targets = a.anchors)
                                              : "path" === a.mode &&
                                                (a.targets = a.paths),
                                          "elementOrigin" in e &&
                                              (a.relativePoints = [
                                                  e.elementOrigin,
                                              ])))
                                    : p(e) && (a.enabled = e);
                            }
                        }
                        return this;
                    }
                    var h = {},
                        l = ["drag", "resize", "gesture"];
                    for (i = 0; i < l.length; i++)
                        t in Ot[l[i]] && (h[l[i]] = this.options[l[i]][t]);
                    return h;
                },
                inertia: function (t) {
                    var e = this.setOptions("inertia", t);
                    return e === this ? this : e.drag;
                },
                getAction: function (t, e, i, r) {
                    var s = this.defaultActionChecker(t, i, r);
                    return this.options.actionChecker
                        ? this.options.actionChecker(t, e, s, this, r, i)
                        : s;
                },
                defaultActionChecker: et,
                actionChecker: function (t) {
                    return a(t)
                        ? ((this.options.actionChecker = t), this)
                        : null === t
                        ? (delete this.options.actionChecker, this)
                        : this.options.actionChecker;
                },
                getRect: function (t) {
                    return (
                        (t = t || this._element),
                        this.selector &&
                            !i(t) &&
                            (t = this._context.querySelector(this.selector)),
                        T(t)
                    );
                },
                rectChecker: function (t) {
                    return a(t)
                        ? ((this.getRect = t), this)
                        : null === t
                        ? (delete this.options.getRect, this)
                        : this.getRect;
                },
                styleCursor: function (t) {
                    return p(t)
                        ? ((this.options.styleCursor = t), this)
                        : null === t
                        ? (delete this.options.styleCursor, this)
                        : this.options.styleCursor;
                },
                preventDefault: function (t) {
                    return /^(always|never|auto)$/.test(t)
                        ? ((this.options.preventDefault = t), this)
                        : p(t)
                        ? ((this.options.preventDefault = t
                              ? "always"
                              : "never"),
                          this)
                        : this.options.preventDefault;
                },
                origin: function (t) {
                    return c(t)
                        ? ((this.options.origin = t), this)
                        : o(t)
                        ? ((this.options.origin = t), this)
                        : this.options.origin;
                },
                deltaSource: function (t) {
                    return "page" === t || "client" === t
                        ? ((this.options.deltaSource = t), this)
                        : this.options.deltaSource;
                },
                restrict: function (t) {
                    if (!o(t)) return this.setOptions("restrict", t);
                    for (
                        var e, i = ["drag", "resize", "gesture"], r = 0;
                        r < i.length;
                        r++
                    ) {
                        var s = i[r];
                        if (s in t) {
                            var n = d({ actions: [s], restriction: t[s] }, t);
                            e = this.setOptions("restrict", n);
                        }
                    }
                    return e;
                },
                context: function () {
                    return this._context;
                },
                _context: ft,
                ignoreFrom: function (t) {
                    return c(t)
                        ? ((this.options.ignoreFrom = t), this)
                        : i(t)
                        ? ((this.options.ignoreFrom = t), this)
                        : this.options.ignoreFrom;
                },
                allowFrom: function (t) {
                    return c(t)
                        ? ((this.options.allowFrom = t), this)
                        : i(t)
                        ? ((this.options.allowFrom = t), this)
                        : this.options.allowFrom;
                },
                element: function () {
                    return this._element;
                },
                fire: function (t) {
                    if (!t || !t.type || !ct(Wt, t.type)) return this;
                    var e,
                        i,
                        r,
                        s = "on" + t.type;
                    if (t.type in this._iEvents)
                        for (
                            i = 0, r = (e = this._iEvents[t.type]).length;
                            i < r && !t.immediatePropagationStopped;
                            i++
                        )
                            e[i].name, e[i](t);
                    if (
                        (a(this[s]) && (this[s].name, this[s](t)),
                        t.type in Ut && (e = Ut[t.type]))
                    )
                        for (
                            i = 0, r = e.length;
                            i < r && !t.immediatePropagationStopped;
                            i++
                        )
                            e[i].name, e[i](t);
                    return this;
                },
                on: function (t, e, i) {
                    var r;
                    if (
                        (l(t) &&
                            -1 !== t.search(" ") &&
                            (t = t.trim().split(/ +/)),
                        n(t))
                    ) {
                        for (r = 0; r < t.length; r++) this.on(t[r], e, i);
                        return this;
                    }
                    if (o(t)) {
                        for (var s in t) this.on(s, t[s], e);
                        return this;
                    }
                    if (("wheel" === t && (t = Ht), (i = !!i), ct(Wt, t)))
                        t in this._iEvents
                            ? this._iEvents[t].push(e)
                            : (this._iEvents[t] = [e]);
                    else if (this.selector) {
                        if (!At[t])
                            for (
                                At[t] = {
                                    selectors: [],
                                    contexts: [],
                                    listeners: [],
                                },
                                    r = 0;
                                r < Tt.length;
                                r++
                            )
                                Bt.add(Tt[r], t, rt), Bt.add(Tt[r], t, st, !0);
                        var a,
                            h = At[t];
                        for (
                            a = h.selectors.length - 1;
                            a >= 0 &&
                            (h.selectors[a] !== this.selector ||
                                h.contexts[a] !== this._context);
                            a--
                        );
                        -1 === a &&
                            ((a = h.selectors.length),
                            h.selectors.push(this.selector),
                            h.contexts.push(this._context),
                            h.listeners.push([])),
                            h.listeners[a].push([e, i]);
                    } else Bt.add(this._element, t, e, i);
                    return this;
                },
                off: function (t, e, i) {
                    var r;
                    if (
                        (l(t) &&
                            -1 !== t.search(" ") &&
                            (t = t.trim().split(/ +/)),
                        n(t))
                    ) {
                        for (r = 0; r < t.length; r++) this.off(t[r], e, i);
                        return this;
                    }
                    if (o(t)) {
                        for (var s in t) this.off(s, t[s], e);
                        return this;
                    }
                    var a,
                        h = -1;
                    if (((i = !!i), "wheel" === t && (t = Ht), ct(Wt, t)))
                        (a = this._iEvents[t]) &&
                            -1 !== (h = lt(a, e)) &&
                            this._iEvents[t].splice(h, 1);
                    else if (this.selector) {
                        var p = At[t],
                            c = !1;
                        if (!p) return this;
                        for (h = p.selectors.length - 1; h >= 0; h--)
                            if (
                                p.selectors[h] === this.selector &&
                                p.contexts[h] === this._context
                            ) {
                                var d = p.listeners[h];
                                for (r = d.length - 1; r >= 0; r--) {
                                    var u = d[r][0],
                                        g = d[r][1];
                                    if (u === e && g === i) {
                                        d.splice(r, 1),
                                            d.length ||
                                                (p.selectors.splice(h, 1),
                                                p.contexts.splice(h, 1),
                                                p.listeners.splice(h, 1),
                                                Bt.remove(this._context, t, rt),
                                                Bt.remove(
                                                    this._context,
                                                    t,
                                                    st,
                                                    !0
                                                ),
                                                p.selectors.length ||
                                                    (At[t] = null)),
                                            (c = !0);
                                        break;
                                    }
                                }
                                if (c) break;
                            }
                    } else Bt.remove(this._element, t, e, i);
                    return this;
                },
                set: function (t) {
                    o(t) || (t = {}), (this.options = d({}, Ot.base));
                    var e,
                        i = ["drag", "drop", "resize", "gesture"],
                        r = [
                            "draggable",
                            "dropzone",
                            "resizable",
                            "gesturable",
                        ],
                        s = d(d({}, Ot.perAction), t[n] || {});
                    for (e = 0; e < i.length; e++) {
                        var n = i[e];
                        (this.options[n] = d({}, Ot[n])),
                            this.setPerAction(n, s),
                            this[r[e]](t[n]);
                    }
                    var a = [
                        "accept",
                        "actionChecker",
                        "allowFrom",
                        "deltaSource",
                        "dropChecker",
                        "ignoreFrom",
                        "origin",
                        "preventDefault",
                        "rectChecker",
                        "styleCursor",
                    ];
                    for (e = 0, te = a.length; e < te; e++) {
                        var h = a[e];
                        (this.options[h] = Ot.base[h]), h in t && this[h](t[h]);
                    }
                    return this;
                },
                unset: function () {
                    if ((Bt.remove(this._element, "all"), l(this.selector)))
                        for (var t in At)
                            for (
                                var e = At[t], i = 0;
                                i < e.selectors.length;
                                i++
                            ) {
                                e.selectors[i] === this.selector &&
                                    e.contexts[i] === this._context &&
                                    (e.selectors.splice(i, 1),
                                    e.contexts.splice(i, 1),
                                    e.listeners.splice(i, 1),
                                    e.selectors.length || (At[t] = null)),
                                    Bt.remove(this._context, t, rt),
                                    Bt.remove(this._context, t, st, !0);
                                break;
                            }
                    else
                        Bt.remove(this, "all"),
                            this.options.styleCursor &&
                                (this._element.style.cursor = "");
                    return this.dropzone(!1), Ct.splice(lt(Ct, this), 1), nt;
                },
            }).snap = at(
                ot.prototype.snap,
                "Interactable#snap is deprecated. See the new documentation for snapping at http://interactjs.io/docs/snapping"
            )),
            (ot.prototype.restrict = at(
                ot.prototype.restrict,
                "Interactable#restrict is deprecated. See the new documentation for resticting at http://interactjs.io/docs/restriction"
            )),
            (ot.prototype.inertia = at(
                ot.prototype.inertia,
                "Interactable#inertia is deprecated. See the new documentation for inertia at http://interactjs.io/docs/inertia"
            )),
            (ot.prototype.autoScroll = at(
                ot.prototype.autoScroll,
                "Interactable#autoScroll is deprecated. See the new documentation for autoScroll at http://interactjs.io/docs/#autoscroll"
            )),
            (ot.prototype.squareResize = at(
                ot.prototype.squareResize,
                "Interactable#squareResize is deprecated. See http://interactjs.io/docs/#resize-square"
            )),
            (ot.prototype.accept = at(
                ot.prototype.accept,
                "Interactable#accept is deprecated. use Interactable#dropzone({ accept: target }) instead"
            )),
            (ot.prototype.dropChecker = at(
                ot.prototype.dropChecker,
                "Interactable#dropChecker is deprecated. use Interactable#dropzone({ dropChecker: checkerFunction }) instead"
            )),
            (ot.prototype.context = at(
                ot.prototype.context,
                "Interactable#context as a method is deprecated. It will soon be a DOM Node instead"
            )),
            (nt.isSet = function (t, e) {
                return -1 !== Ct.indexOfElement(t, e && e.context);
            }),
            (nt.on = function (t, e, i) {
                if (
                    (l(t) && -1 !== t.search(" ") && (t = t.trim().split(/ +/)),
                    n(t))
                ) {
                    for (var r = 0; r < t.length; r++) nt.on(t[r], e, i);
                    return nt;
                }
                if (o(t)) {
                    for (var s in t) nt.on(s, t[s], e);
                    return nt;
                }
                return (
                    ct(Wt, t)
                        ? Ut[t]
                            ? Ut[t].push(e)
                            : (Ut[t] = [e])
                        : Bt.add(ft, t, e, i),
                    nt
                );
            }),
            (nt.off = function (t, e, i) {
                if (
                    (l(t) && -1 !== t.search(" ") && (t = t.trim().split(/ +/)),
                    n(t))
                ) {
                    for (var r = 0; r < t.length; r++) nt.off(t[r], e, i);
                    return nt;
                }
                if (o(t)) {
                    for (var s in t) nt.off(s, t[s], e);
                    return nt;
                }
                if (ct(Wt, t)) {
                    var a;
                    t in Ut && -1 !== (a = lt(Ut[t], e)) && Ut[t].splice(a, 1);
                } else Bt.remove(ft, t, e, i);
                return nt;
            }),
            (nt.enableDragging = at(function (t) {
                return null !== t && void 0 !== t
                    ? ((qt.drag = t), nt)
                    : qt.drag;
            }, "interact.enableDragging is deprecated and will soon be removed.")),
            (nt.enableResizing = at(function (t) {
                return null !== t && void 0 !== t
                    ? ((qt.resize = t), nt)
                    : qt.resize;
            }, "interact.enableResizing is deprecated and will soon be removed.")),
            (nt.enableGesturing = at(function (t) {
                return null !== t && void 0 !== t
                    ? ((qt.gesture = t), nt)
                    : qt.gesture;
            }, "interact.enableGesturing is deprecated and will soon be removed.")),
            (nt.eventTypes = Wt),
            (nt.debug = function () {
                var t = Mt[0] || new j();
                return {
                    interactions: Mt,
                    target: t.target,
                    dragging: t.dragging,
                    resizing: t.resizing,
                    gesturing: t.gesturing,
                    prepared: t.prepared,
                    matches: t.matches,
                    matchElements: t.matchElements,
                    prevCoords: t.prevCoords,
                    startCoords: t.startCoords,
                    pointerIds: t.pointerIds,
                    pointers: t.pointers,
                    addPointer: Jt.addPointer,
                    removePointer: Jt.removePointer,
                    recordPointer: Jt.recordPointer,
                    snap: t.snapStatus,
                    restrict: t.restrictStatus,
                    inertia: t.inertiaStatus,
                    downTime: t.downTimes[0],
                    downEvent: t.downEvent,
                    downPointer: t.downPointer,
                    prevEvent: t.prevEvent,
                    Interactable: ot,
                    interactables: Ct,
                    pointerIsDown: t.pointerIsDown,
                    defaultOptions: Ot,
                    defaultActionChecker: et,
                    actionCursors: Nt,
                    dragMove: Jt.dragMove,
                    resizeMove: Jt.resizeMove,
                    gestureMove: Jt.gestureMove,
                    pointerUp: Jt.pointerUp,
                    pointerDown: Jt.pointerDown,
                    pointerMove: Jt.pointerMove,
                    pointerHover: Jt.pointerHover,
                    eventTypes: Wt,
                    events: Bt,
                    globalEvents: Ut,
                    delegatedEvents: At,
                    prefixedPropREs: Kt,
                };
            }),
            (nt.getPointerAverage = M),
            (nt.getTouchBBox = P),
            (nt.getTouchDistance = A),
            (nt.getTouchAngle = O),
            (nt.getElementRect = T),
            (nt.getElementClientRect = D),
            (nt.matchesSelector = dt),
            (nt.closest = I),
            (nt.margin = at(function (t) {
                return h(t) ? ((Yt = t), nt) : Yt;
            }, "interact.margin is deprecated. Use interact(target).resizable({ margin: number }); instead.")),
            (nt.supportsTouch = function () {
                return kt;
            }),
            (nt.supportsPointerEvent = function () {
                return Xt;
            }),
            (nt.stop = function (t) {
                for (var e = Mt.length - 1; e >= 0; e--) Mt[e].stop(t);
                return nt;
            }),
            (nt.dynamicDrop = function (t) {
                return p(t) ? ((Pt = t), nt) : Pt;
            }),
            (nt.pointerMoveTolerance = function (t) {
                return h(t) ? ((Rt = t), this) : Rt;
            }),
            (nt.maxInteractions = function (t) {
                return h(t) ? ((Ft = t), this) : Ft;
            }),
            (nt.createSnapGrid = function (t) {
                return function (e, i) {
                    var r = 0,
                        s = 0;
                    o(t.offset) && ((r = t.offset.x), (s = t.offset.y));
                    var n = Math.round((e - r) / t.x),
                        a = Math.round((i - s) / t.y);
                    return { x: n * t.x + r, y: a * t.y + s, range: t.range };
                };
            }),
            pt(ft),
            (Gt in Element.prototype && a(Element.prototype[Gt])) ||
                (vt = function (t, e, i) {
                    for (
                        var r = 0,
                            s = (i = i || t.parentNode.querySelectorAll(e))
                                .length;
                        r < s;
                        r++
                    )
                        if (i[r] === t) return !0;
                    return !1;
                }),
            (function () {
                for (
                    var e = 0, i = ["ms", "moz", "webkit", "o"], r = 0;
                    r < i.length && !t.requestAnimationFrame;
                    ++r
                )
                    (Lt = t[i[r] + "RequestAnimationFrame"]),
                        (jt =
                            t[i[r] + "CancelAnimationFrame"] ||
                            t[i[r] + "CancelRequestAnimationFrame"]);
                Lt ||
                    (Lt = function (t) {
                        var i = new Date().getTime(),
                            r = Math.max(0, 16 - (i - e)),
                            s = setTimeout(function () {
                                t(i + r);
                            }, r);
                        return (e = i + r), s;
                    }),
                    jt ||
                        (jt = function (t) {
                            clearTimeout(t);
                        });
            })(),
            "undefined" != typeof exports
                ? ("undefined" != typeof module &&
                      module.exports &&
                      (exports = module.exports = nt),
                  (exports.interact = nt))
                : "function" == typeof define && define.amd
                ? define("interact", function () {
                      return nt;
                  })
                : (t.interact = nt);
    }
})("undefined" == typeof window ? void 0 : window);
