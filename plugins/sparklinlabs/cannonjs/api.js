(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

SupAPI.registerPlugin("typescript", "CANNON", {
    code: "",
    defs: "/*\r\n// Type definitions for cannon.js\r\n// Initial Project: https://github.com/schteppe/cannon.js\r\n// Project: https://github.com/clark-stevenson/cannon.d.ts\r\n\r\nThe MIT License (MIT)\r\n\r\nCopyright (c) 2014 Clark Stevenson\r\n\r\nPermission is hereby granted, free of charge, to any person obtaining a copy\r\nof this software and associated documentation files (the \"Software\"), to deal\r\nin the Software without restriction, including without limitation the rights\r\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\r\ncopies of the Software, and to permit persons to whom the Software is\r\nfurnished to do so, subject to the following conditions:\r\n\r\nThe above copyright notice and this permission notice shall be included in all\r\ncopies or substantial portions of the Software.\r\n\r\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\r\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\r\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\r\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\r\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\r\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\r\nSOFTWARE.*/\r\n\r\ndeclare module CANNON {\r\n\r\n    export interface IAABBOptions {\r\n\r\n        upperBound?: Vec3;\r\n        lowerBound?: Vec3;\r\n\r\n    }\r\n\r\n    export class AABB {\r\n\r\n        lowerBound: Vec3;\r\n        upperBound: Vec3;\r\n\r\n        constructor(options?: IAABBOptions);\r\n\r\n        setFromPoints(points: Vec3[], position?: Vec3, quaternion?: Quaternion, skinSize?: number): void;\r\n        copy(aabb: AABB): void;\r\n        extend(aabb: AABB): void;\r\n        overlaps(aabb: AABB): boolean;\r\n\r\n    }\r\n\r\n    export class ArrayCollisionMatrix {\r\n\r\n        matrix: Mat3[];\r\n\r\n        get(i: number, j: number): number;\r\n        set(i: number, j: number, value?: number): void;\r\n        reset(): void;\r\n        setNumObjects(n: number): void;\r\n\r\n    }\r\n\r\n    export class BroadPhase {\r\n\r\n        world: World;\r\n        useBoundingBoxes: boolean;\r\n        dirty: boolean;\r\n\r\n        collisionPairs(world: World, p1: Body[], p2: Body[]): void;\r\n        needBroadphaseCollision(bodyA: Body, bodyB: Body): boolean;\r\n        intersectionTest(bodyA: Body, bodyB: Body, pairs1: Body[], pairs2: Body[]): void;\r\n        doBoundingSphereBroadphase(bodyA: Body, bodyB: Body, pairs1: Body[], pairs2: Body[]): void;\r\n        doBoundingBoxBroadphase(bodyA: Body, bodyB: Body, pairs1: Body[], pairs2: Body[]): void;\r\n        makePairsUnique(pairs1: Body[], pairs2: Body[]): void;\r\n        setWorld(world: World): void;\r\n        boundingSphereCheck(bodyA: Body, bodyB: Body): boolean;\r\n        aabbQuery(world: World, aabb: AABB, result: Body[]): Body[];\r\n\r\n    }\r\n\r\n    export class GridBroadphase extends BroadPhase {\r\n\r\n        nx: number;\r\n        ny: number;\r\n        nz: number;\r\n        aabbMin: Vec3;\r\n        aabbMax: Vec3;\r\n        bins: any[];\r\n\r\n        constructor(aabbMin?: Vec3, aabbMax?: Vec3, nx?: number, ny?: number, nz?: number);\r\n\r\n    }\r\n\r\n    export class NaiveBroadphase extends BroadPhase {\r\n    }\r\n\r\n    export class ObjectCollisionMatrix {\r\n\r\n        matrix: number[];\r\n\r\n        get(i: number, j: number): number;\r\n        set(i: number, j: number, value: number): void;\r\n        reset(): void;\r\n        setNumObjects(n: number): void;\r\n\r\n    }\r\n\r\n    export class Ray {\r\n\r\n        from: Vec3;\r\n        to: Vec3;\r\n        precision: number;\r\n        checkCollisionResponse: boolean;\r\n\r\n        constructor(from?: Vec3, to?: Vec3);\r\n\r\n        getAABB(result: RaycastResult): void;\r\n\r\n    }\r\n\r\n    export class RaycastResult {\r\n\r\n        rayFromWorld: Vec3;\r\n        rayToWorld: Vec3;\r\n        hitNormalWorld: Vec3;\r\n        hitPointWorld: Vec3;\r\n        hasHit: boolean;\r\n        shape: Shape;\r\n        body: Body;\r\n        distance: number;\r\n\r\n        reset(): void;\r\n        set(rayFromWorld: Vec3, rayToWorld: Vec3, hitNormalWorld: Vec3, hitPointWorld: Vec3, shape: Shape, body: Body, distance: number): void;\r\n\r\n    }\r\n\r\n    export class SAPBroadphase extends BroadPhase {\r\n\r\n        static insertionSortX(a: any[]): any[];\r\n        static insertionSortY(a: any[]): any[];\r\n        static insertionSortZ(a: any[]): any[];\r\n        static checkBounds(bi: Body, bj: Body, axisIndex?: number): boolean;\r\n\r\n        axisList: any[];\r\n        world: World;\r\n        axisIndex: number;\r\n\r\n        constructor(world?: World);\r\n\r\n        autoDetectAxis(): void;\r\n        aabbQuery(world: World, aabb: AABB, result?: Body[]): Body[];\r\n\r\n    }\r\n\r\n    export interface IConstraintOptions {\r\n\r\n        collideConnected?: boolean;\r\n        wakeUpBodies?: boolean;\r\n\r\n    }\r\n\r\n    export class Constraint {\r\n\r\n        equations: any[];\r\n        bodyA: Body;\r\n        bodyB: Body;\r\n        id: number;\r\n        collideConnected: boolean;\r\n\r\n        constructor(bodyA: Body, bodyB: Body, options?: IConstraintOptions);\r\n\r\n        update(): void;\r\n\r\n    }\r\n\r\n    export class DistanceConstraint extends Constraint {\r\n\r\n        constructor(bodyA: Body, bodyB: Body, distance: number, maxForce?: number);\r\n\r\n    }\r\n\r\n    export interface IHingeConstraintOptions {\r\n\r\n        pivotA?: Vec3;\r\n        axisA?: Vec3;\r\n        pivotB?: Vec3;\r\n        axisB?: Vec3;\r\n        maxForce?: number;\r\n\r\n    }\r\n\r\n    export class HingeConstraint extends Constraint {\r\n\r\n        motorEnabled: boolean;\r\n        motorTargetVelocity: number;\r\n        motorMinForce: number;\r\n        motorMaxForce: number;\r\n        motorEquation: RotationalMotorEquation;\r\n\r\n        constructor(bodyA: Body, bodyB: Body, options?: IHingeConstraintOptions);\r\n\r\n        enableMotor(): void;\r\n        disableMotor(): void;\r\n\r\n    }\r\n\r\n    export class PointToPointConstraint extends Constraint {\r\n\r\n        constructor(bodyA: Body, pivotA: Vec3, bodyB: Body, pivotB: Vec3, maxForce?: number);\r\n\r\n    }\r\n\r\n    export class Equation {\r\n\r\n        id: number;\r\n        minForce: number;\r\n        maxForce: number;\r\n        bi: Body;\r\n        bj: Body;\r\n        a: number;\r\n        b: number;\r\n        eps: number;\r\n        jacobianElementA: JacobianElement;\r\n        jacobianElementB: JacobianElement;\r\n        enabled: boolean;\r\n\r\n        constructor(bi: Body, bj: Body, minForce?: number, maxForce?: number);\r\n\r\n        setSpookParams(stiffness: number, relaxation: number, timeStep: number);\r\n        computeB(a: number, b: number, h: number): number;\r\n        computeGq(): number;\r\n        computeGW(): number;\r\n        computeGWlamda(): number;\r\n        computeGiMf(): number;\r\n        computeGiMGt(): number;\r\n        addToWlamda(deltalambda: number): number;\r\n        computeC(): number;\r\n\r\n    }\r\n\r\n    export class FrictionEquation extends Equation {\r\n\r\n        constructor(bi: Body, bj: Body, slipForce: number);\r\n\r\n    }\r\n\r\n    export class RotationalEquation extends Equation {\r\n\r\n        ni: Vec3;\r\n        nj: Vec3;\r\n        nixnj: Vec3;\r\n        njxni: Vec3;\r\n        invIi: Mat3;\r\n        invIj: Mat3;\r\n        relVel: Vec3;\r\n        relForce: Vec3;\r\n\r\n        constructor(bodyA: Body, bodyB: Body);\r\n\r\n    }\r\n\r\n    export class RotationalMotorEquation extends Equation {\r\n\r\n        axisA: Vec3;\r\n        axisB: Vec3;\r\n        invLi: Mat3;\r\n        invIj: Mat3;\r\n        targetVelocity: number;\r\n\r\n        constructor(bodyA: Body, bodyB: Body, maxForce?: number);\r\n\r\n    }\r\n\r\n    export class ContactEquation extends Equation {\r\n\r\n        restitution: number;\r\n        ri: Vec3;\r\n        rj: Vec3;\r\n        penetrationVec: Vec3;\r\n        ni: Vec3;\r\n        rixn: Vec3;\r\n        rjxn: Vec3;\r\n        invIi: Mat3;\r\n        invIj: Mat3;\r\n        biInvInertiaTimesRixn: Vec3;\r\n        bjInvInertiaTimesRjxn: Vec3;\r\n\r\n        constructor(bi: Body, bj: Body);\r\n\r\n    }\r\n\r\n    export interface IContactMaterialOptions {\r\n\r\n        friction?: number;\r\n        restitution?: number;\r\n        contactEquationStiffness?: number;\r\n        contactEquationRelaxation?: number;\r\n        frictionEquationStiffness?: number;\r\n        frictionEquationRelaxation?: number;\r\n\r\n    }\r\n\r\n    export class ContactMaterial {\r\n\r\n        id: number;\r\n        materials: Material[];\r\n        friction: number;\r\n        restitution: number;\r\n        contactEquationStiffness: number;\r\n        contactEquationRelaxation: number;\r\n        frictionEquationStiffness: number;\r\n        frictionEquationRelaxation: number;\r\n\r\n        constructor(m1: Material, m2: Material, options?: IContactMaterialOptions);\r\n\r\n    }\r\n\r\n    export class Material {\r\n\r\n        name: string;\r\n        id: number;\r\n\r\n        constructor(name: string);\r\n\r\n    }\r\n\r\n    export class JacobianElement {\r\n\r\n        spatial: Vec3;\r\n        rotational: Vec3;\r\n\r\n        multiplyElement(element: JacobianElement): number;\r\n        multiplyVectors(spacial: Vec3, rotational: Vec3): number;\r\n\r\n    }\r\n\r\n    export class Mat3 {\r\n\r\n        constructor(elements?: number[]);\r\n\r\n        identity(): void;\r\n        setZero(): void;\r\n        setTrace(vec3: Vec3): void;\r\n        getTrace(target: Vec3): void;\r\n        vmult(v: Vec3, target?: Vec3): Vec3;\r\n        smult(s: number): void;\r\n        mmult(m: Mat3): Mat3;\r\n        scale(v: Vec3, target?: Mat3): Mat3;\r\n        solve(b: Vec3, target?: Vec3): Vec3;\r\n        e(row: number, column: number, value?: number): number;\r\n        copy(source: Mat3): Mat3;\r\n        toString(): string;\r\n        reverse(target?: Mat3): Mat3;\r\n        setRotationFromQuaternion(q: Quaternion): Mat3;\r\n        transpose(target?: Mat3): Mat3;\r\n\r\n    }\r\n\r\n    export class Quaternion {\r\n\r\n        x: number;\r\n        y: number;\r\n        z: number;\r\n        w: number;\r\n\r\n        constructor(x?: number, y?: number, z?: number, w?: number);\r\n\r\n        set(x: number, y: number, z: number, w: number): void;\r\n        toString(): string;\r\n        toArray(): number[];\r\n        setFromAxisAngle(axis: Vec3, angle: number): void;\r\n        toAxisAngle(targetAxis?: Vec3): any[];\r\n        setFromVectors(u: Vec3, v: Vec3): void;\r\n        mult(q: Quaternion, target?: Quaternion): Quaternion;\r\n        inverse(target?: Quaternion): Quaternion;\r\n        conjugate(target?: Quaternion): Quaternion;\r\n        normalize(): void;\r\n        normalizeFast(): void;\r\n        vmult(v: Vec3, target?: Vec3): Vec3;\r\n        copy(source: Quaternion): Quaternion;\r\n        toEuler(target: Vec3, order?: string): void;\r\n        setFromEuler(x: number, y: number, z: number, order?: string): Quaternion;\r\n        clone(): Quaternion;\r\n\r\n    }\r\n\r\n    export class Transform {\r\n\r\n        static pointToLocalFrame(position: Vec3, quaternion: Quaternion, worldPoint: Vec3, result?: Vec3): Vec3;\r\n        static pointToWorldFrame(position: Vec3, quaternion: Quaternion, localPoint: Vec3, result?: Vec3): Vec3;\r\n\r\n        position: Vec3;\r\n        quaternion: Quaternion;\r\n\r\n        vectorToWorldFrame(localVector: Vec3, result?: Vec3): Vec3;\r\n        vectorToLocalFrame(position: Vec3, quaternion: Quaternion, worldVector: Vec3, result?: Vec3): Vec3;\r\n\r\n    }\r\n\r\n    export class Vec3 {\r\n\r\n        static ZERO: Vec3;\r\n\r\n        x: number;\r\n        y: number;\r\n        z: number;\r\n\r\n        constructor(x?: number, y?: number, z?: number);\r\n\r\n        cross(v: Vec3, target?: Vec3): Vec3;\r\n        set(x: number, y: number, z: number): Vec3;\r\n        setZero(): void;\r\n        vadd(v: Vec3, target?: Vec3): Vec3;\r\n        vsub(v: Vec3, target?: Vec3): Vec3;\r\n        crossmat(): Mat3;\r\n        normalize(): number;\r\n        unit(target?: Vec3): Vec3;\r\n        norm(): number;\r\n        norm2(): number;\r\n        distanceTo(p: Vec3): number;\r\n        mult(scalar: number, target?: Vec3): Vec3;\r\n        scale(scalar: number, target?: Vec3): Vec3;\r\n        dot(v: Vec3): number;\r\n        isZero(): boolean;\r\n        negate(target?: Vec3): Vec3;\r\n        tangents(t1: Vec3, t2: Vec3): void;\r\n        toString(): string;\r\n        toArray(): number[];\r\n        copy(source: Vec3): Vec3;\r\n        lerp(v: Vec3, t: number, target?: Vec3): void;\r\n        almostEquals(v: Vec3, precision?: number): boolean;\r\n        almostZero(precision?: number): boolean;\r\n        isAntiparallelTo(v: Vec3, prescision?: number): boolean;\r\n        clone(): Vec3;\r\n\r\n    }\r\n\r\n    export interface IBodyOptions {\r\n\r\n        position?: Vec3;\r\n        velocity?: Vec3;\r\n        angularVelocity?: Vec3;\r\n        quaternion?: Quaternion;\r\n        mass?: number;\r\n        material?: number;\r\n        type?: number;\r\n        linearDamping?: number;\r\n\r\n    }\r\n\r\n    export class Body extends EventTarget {\r\n\r\n        static DYNAMIC: number;\r\n        static STATIC: number;\r\n        static KINEMATIC: number;\r\n        static AWAKE: number;\r\n        static SLEEPY: number;\r\n        static SLEEPING: number;\r\n        static sleepyEvent: IEvent;\r\n        static sleepEvent: IEvent;\r\n\r\n        id: number;\r\n        world: World;\r\n        preStep: Function;\r\n        postStep: Function;\r\n        vlambda: Vec3;\r\n        collisionFilterGroup: number;\r\n        collisionFilterMask: number;\r\n        collisionResponse: boolean;\r\n        position: Vec3;\r\n        previousPosition: Vec3;\r\n        initPosition: Vec3;\r\n        velocity: Vec3;\r\n        initVelocity: Vec3;\r\n        force: Vec3;\r\n        mass: number;\r\n        invMass: number;\r\n        material: Material;\r\n        linearDamping: number;\r\n        type: number;\r\n        allowSleep: boolean;\r\n        sleepState: number;\r\n        sleepSpeedLimit: number;\r\n        sleepTimeLimit: number;\r\n        timeLastSleepy: number;\r\n        torque: Vec3;\r\n        quaternion: Quaternion;\r\n        initQuaternion: Quaternion;\r\n        angularVelocity: Vec3;\r\n        initAngularVelocity: Vec3;\r\n        interpolatedPosition: Vec3;\r\n        interpolatedQuaternion: Quaternion;\r\n        shapes: Shape[];\r\n        shapeOffsets: any[];\r\n        shapeOrentiations: any[];\r\n        intertia: Vec3;\r\n        invInertia: Vec3;\r\n        invInertiaWorld: Mat3;\r\n        invMassSolve: number;\r\n        invInertiaSolve: Vec3;\r\n        invInteriaWorldSolve: Mat3;\r\n        fixedRotation: boolean;\r\n        angularDamping: number;\r\n        aabb: AABB;\r\n        aabbNeedsUpdate: boolean;\r\n        wlambda: Vec3;\r\n\r\n        constructor(options?: IBodyOptions);\r\n\r\n        wakeUp(): void;\r\n        sleep(): void;\r\n        sleepTick(time: number): void;\r\n        updateSolveMassProperties(): void;\r\n        pointToLocalFrame(worldPoint: Vec3, result?: Vec3): Vec3;\r\n        pointToWorldFrame(localPoint: Vec3, result?: Vec3): Vec3;\r\n        vectorToWorldFrame(localVector: Vec3, result?: Vec3): Vec3;\r\n        addShape(shape: Shape, offset?: Vec3, orientation?: Vec3): void;\r\n        updateBoundingRadius(): void;\r\n        computeAABB(): void;\r\n        updateIntertiaWorld(force: Vec3): void;\r\n        applyForce(force: Vec3, worldPoint: Vec3): void;\r\n        applyImpulse(impulse: Vec3, worldPoint: Vec3): void;\r\n        updateMassProperties(): void;\r\n        getVelocityAtWorldPoint(worldPoint: Vec3, result: Vec3): Vec3;\r\n\r\n    }\r\n\r\n    export interface IRaycastVehicleOptions {\r\n\r\n        chasisBody?: Body;\r\n        indexRightAxis?: number;\r\n        indexLeftAxis?: number;\r\n        indexUpAxis?: number;\r\n\r\n    }\r\n\r\n    export interface IWheelInfoOptions {\r\n\r\n        chassisConnectionPointLocal?: Vec3;\r\n        chassisConnectionPointWorld?: Vec3;\r\n        directionLocal?: Vec3;\r\n        directionWorld?: Vec3;\r\n        axleLocal?: Vec3;\r\n        axleWorld?: Vec3;\r\n        suspensionRestLength?: number;\r\n        suspensionMaxLength?: number;\r\n        radius?: number;\r\n        suspensionStiffness?: number;\r\n        dampingCompression?: number;\r\n        dampingRelaxation?: number;\r\n        frictionSlip?: number;\r\n        steering?: number;\r\n        rotation?: number;\r\n        deltaRotation?: number;\r\n        rollInfluence?: number;\r\n        maxSuspensionForce?: number;\r\n        isFronmtWheel?: boolean;\r\n        clippedInvContactDotSuspension?: number;\r\n        suspensionRelativeVelocity?: number;\r\n        suspensionForce?: number;\r\n        skidInfo?: number;\r\n        suspensionLength?: number;\r\n        maxSuspensionTravel?: number;\r\n        useCustomSlidingRotationalSpeed?: boolean;\r\n        customSlidingRotationalSpeed?: number;\r\n\r\n        position?: Vec3;\r\n        direction?: Vec3;\r\n        axis?: Vec3;\r\n        body?: Body;\r\n\r\n    }\r\n\r\n    export class WheelInfo {\r\n\r\n        maxSuspensionTravbel: number;\r\n        customSlidingRotationalSpeed: number;\r\n        useCustomSlidingRotationalSpeed: boolean;\r\n        sliding: boolean;\r\n        chassisConnectionPointLocal: Vec3;\r\n        chassisConnectionPointWorld: Vec3;\r\n        directionLocal: Vec3;\r\n        directionWorld: Vec3;\r\n        axleLocal: Vec3;\r\n        axleWorld: Vec3;\r\n        suspensionRestLength: number;\r\n        suspensionMaxLength: number;\r\n        radius: number;\r\n        suspensionStiffness: number;\r\n        dampingCompression: number;\r\n        dampingRelaxation: number;\r\n        frictionSlip: number;\r\n        steering: number;\r\n        rotation: number;\r\n        deltaRotation: number;\r\n        rollInfluence: number;\r\n        maxSuspensionForce: number;\r\n        engineForce: number;\r\n        brake: number;\r\n        isFrontWheel: boolean;\r\n        clippedInvContactDotSuspension: number;\r\n        suspensionRelativeVelocity: number;\r\n        suspensionForce: number;\r\n        skidInfo: number;\r\n        suspensionLength: number;\r\n        sideImpulse: number;\r\n        forwardImpulse: number;\r\n        raycastResult: RaycastResult;\r\n        worldTransform: Transform;\r\n        isInContact: boolean;\r\n\r\n        constructor(options?: IWheelInfoOptions);\r\n\r\n    }\r\n\r\n    export class RaycastVehicle {\r\n\r\n        chassisBody: Body;\r\n        wheelInfos: IWheelInfoOptions[];\r\n        sliding: boolean;\r\n        world: World;\r\n        iindexRightAxis: number;\r\n        indexForwardAxis: number;\r\n        indexUpAxis: number;\r\n\r\n        constructor(options?: IRaycastVehicleOptions);\r\n\r\n        addWheel(options?: IWheelInfoOptions);\r\n        setSteeringValue(value: number, wheelIndex: number): void;\r\n        applyEngineForce(value: number, wheelIndex: number): void;\r\n        setBrake(brake: number, wheelIndex: number): void;\r\n        addToWorld(world: World): void;\r\n        getVehicleAxisWorld(axisIndex: number, result: Vec3): Vec3;\r\n        updateVehicle(timeStep: number): void;\r\n        updateSuspension(deltaTime: number): void;\r\n        removeFromWorld(world: World): void;\r\n        getWheelTransformWorld(wheelIndex: number): Transform;\r\n\r\n    }\r\n\r\n    export interface IRigidVehicleOptions {\r\n\r\n        chasisBody: Body;\r\n\r\n    }\r\n\r\n    export class RigidVehicle {\r\n\r\n        wheelBodies: Body[];\r\n        coordinateSystem: Vec3;\r\n        chasisBody: Body;\r\n        constraints: Constraint[];\r\n        wheelAxes: Vec3[];\r\n        wheelForces: Vec3[];\r\n\r\n        constructor(options?: IRigidVehicleOptions);\r\n\r\n        addWheel(options?: IWheelInfoOptions): Body;\r\n        setSteeringValue(value: number, wheelIndex: number): void;\r\n        setMotorSpeed(value: number, wheelIndex: number): void;\r\n        disableMotor(wheelIndex: number): void;\r\n        setWheelForce(value: number, wheelIndex: number): void;\r\n        applyWheelForce(value: number, wheelIndex: number): void;\r\n        addToWorld(world: World): void;\r\n        removeFromWorld(world: World): void;\r\n        getWheelSpeed(wheelIndex: number): number;\r\n\r\n    }\r\n\r\n    export class SPHSystem {\r\n\r\n        particles: Particle[];\r\n        density: number;\r\n        smoothingRadius: number;\r\n        speedOfSound; number;\r\n        viscosity: number;\r\n        eps: number;\r\n        pressures: number[];\r\n        densities: number[];\r\n        neighbors: number[];\r\n\r\n        add(particle: Particle): void;\r\n        remove(particle: Particle): void;\r\n        getNeighbors(particle: Particle, neighbors: Particle[]): void;\r\n        update(): void;\r\n        w(r: number): number;\r\n        gradw(rVec: Vec3, resultVec: Vec3): void;\r\n        nablaw(r: number): number;\r\n\r\n    }\r\n\r\n    export interface ISpringOptions {\r\n\r\n        restLength?: number;\r\n        stiffness?: number;\r\n        damping?: number;\r\n        worldAnchorA?: Vec3;\r\n        worldAnchorB?: Vec3;\r\n        localAnchorA?: Vec3;\r\n        localAnchorB?: Vec3;\r\n\r\n    }\r\n\r\n    export class Spring {\r\n\r\n        restLength: number;\r\n        stffness: number;\r\n        damping: number;\r\n        bodyA: Body;\r\n        bodyB: Body;\r\n        localAnchorA: Vec3;\r\n        localAnchorB: Vec3;\r\n\r\n        constructor(options?: ISpringOptions);\r\n\r\n        setWorldAnchorA(worldAnchorA: Vec3): void;\r\n        setWorldAnchorB(worldAnchorB: Vec3): void;\r\n        getWorldAnchorA(result: Vec3): void;\r\n        getWorldAnchorB(result: Vec3): void;\r\n        applyForce(): void;\r\n\r\n    }\r\n\r\n    export class Box extends Shape {\r\n\r\n        static calculateIntertia(halfExtents: Vec3, mass: number, target: Vec3): void;\r\n\r\n        boundingSphereRadius: number;\r\n        collisionResponse: boolean;\r\n        halfExtents: Vec3;\r\n        convexPolyhedronRepresentation: ConvexPolyhedron;\r\n\r\n        constructor(halfExtents: Vec3);\r\n\r\n        updateConvexPolyhedronRepresentation(): void;\r\n        calculateLocalInertia(mass: number, target?: Vec3): Vec3;\r\n        getSideNormals(sixTargetVectors: boolean, quat?: Quaternion): Vec3[];\r\n        updateBoundingSphereRadius(): number;\r\n        volume(): number;\r\n        forEachWorldCorner(pos: Vec3, quat: Quaternion, callback: Function): void;\r\n\r\n    }\r\n\r\n    export class ConvexPolyhedron extends Shape {\r\n\r\n        static computeNormal(va: Vec3, vb: Vec3, vc: Vec3, target: Vec3): void;\r\n        static project(hull: ConvexPolyhedron, axis: Vec3, pos: Vec3, quat: Quaternion, result: number[]): void;\r\n\r\n        vertices: Vec3[];\r\n        worldVertices: Vec3[];\r\n        worldVerticesNeedsUpdate: boolean;\r\n        faces: number[];\r\n        faceNormals: Vec3[];\r\n        uniqueEdges: Vec3[];\r\n\r\n        constructor(points?: Vec3[], faces?: number[]);\r\n\r\n        computeEdges(): void;\r\n        computeNormals(): void;\r\n        getFaceNormal(i: number, target: Vec3): Vec3;\r\n        clipAgainstHull(posA: Vec3, quatA: Quaternion, hullB: Vec3, quatB: Quaternion, separatingNormal: Vec3, minDist: number, maxDist: number, result: any[]): void;\r\n        findSaparatingAxis(hullB: ConvexPolyhedron, posA: Vec3, quatA: Quaternion, posB: Vec3, quatB: Quaternion, target: Vec3, faceListA: any[], faceListB: any[]): boolean;\r\n        testSepAxis(axis: Vec3, hullB: ConvexPolyhedron, posA: Vec3, quatA: Quaternion, posB: Vec3, quatB: Quaternion): number;\r\n        getPlaneConstantOfFace(face_i: number): number;\r\n        clipFaceAgainstHull(separatingNormal: Vec3, posA: Vec3, quatA: Quaternion, worldVertsB1: Vec3[], minDist: number, maxDist: number, result: any[]): void;\r\n        clipFaceAgainstPlane(inVertices: Vec3[], outVertices: Vec3[], planeNormal: Vec3, planeConstant: number): Vec3;\r\n        computeWorldVertices(position: Vec3, quat: Quaternion): void;\r\n        computeLocalAABB(aabbmin: Vec3, aabbmax: Vec3): void;\r\n        computeWorldFaceNormals(quat: Quaternion): void;\r\n        calculateWorldAABB(pos: Vec3, quat: Quaternion, min: Vec3, max: Vec3): void;\r\n        getAveragePointLocal(target: Vec3): Vec3;\r\n        transformAllPoints(offset: Vec3, quat: Quaternion): void;\r\n        pointIsInside(p: Vec3): boolean;\r\n\r\n    }\r\n\r\n    export class Cylinder extends Shape {\r\n\r\n        constructor(radiusTop: number, radiusBottom: number, height: number, numSegments: number);\r\n\r\n    }\r\n\r\n    export interface IHightfield {\r\n\r\n        minValue?: number;\r\n        maxValue?: number;\r\n        elementSize: number;\r\n\r\n    }\r\n\r\n    export class Heightfield extends Shape {\r\n\r\n        data: number[];\r\n        maxValue: number;\r\n        minValue: number;\r\n        elementSize: number;\r\n        cacheEnabled: boolean;\r\n        pillarConvex: ConvexPolyhedron;\r\n        pillarOffset: Vec3;\r\n        type: number;\r\n\r\n        constructor(data: number[], options?: IHightfield);\r\n\r\n        update(): void;\r\n        updateMinValue(): void;\r\n        updateMaxValue(): void;\r\n        setHeightValueAtIndex(xi: number, yi: number, value: number): void;\r\n        getRectMinMax(iMinX: number, iMinY: number, iMaxX: number, iMaxY: number, result: any[]): void;\r\n        getIndexOfPosition(x: number, y: number, result: any[], clamp: boolean): boolean;\r\n        getConvexTrianglePillar(xi: number, yi: number, getUpperTriangle: boolean): void;\r\n\r\n    }\r\n\r\n    export class Particle extends Shape {\r\n\r\n    }\r\n\r\n    export class Plane extends Shape {\r\n\r\n        worldNormal: Vec3;\r\n        worldNormalNeedsUpdate: boolean;\r\n        boundingSphereRadius: number;\r\n\r\n        computeWorldNormal(quat: Quaternion): void;\r\n        calculateWorldAABB(pos: Vec3, quat: Quaternion, min: number, max: number): void;\r\n\r\n    }\r\n\r\n    export class Shape {\r\n\r\n        static types: {\r\n\r\n            SPHERE: number;\r\n            PLANE: number;\r\n            BOX: number;\r\n            COMPOUND: number;\r\n            CONVEXPOLYHEDRON: number;\r\n            HEIGHTFIELD: number;\r\n            PARTICLE: number;\r\n            CYLINDER: number;\r\n\r\n        }\r\n\r\n        type: number;\r\n        boundingSphereRadius: number;\r\n        collisionResponse: boolean;\r\n\r\n        updateBoundingSphereRadius(): number;\r\n        volume(): number;\r\n        calculateLocalInertia(mass: number, target: Vec3): Vec3;\r\n\r\n    }\r\n\r\n    export class Sphere extends Shape {\r\n\r\n        radius: number;\r\n\r\n        constructor(radius: number);\r\n\r\n    }\r\n\r\n    export class GSSolver extends Solver {\r\n\r\n        iterations: number;\r\n        tolerance: number;\r\n\r\n        solve(dy: number, world: World): number;\r\n\r\n\r\n    }\r\n\r\n    export class Solver {\r\n\r\n        equations: Equation[];\r\n\r\n        solve(dy: number, world: World): number;\r\n        addEquation(eq: Equation): void;\r\n        removeEquation(eq: Equation): void;\r\n        removeAllEquations(): void;\r\n\r\n    }\r\n\r\n    export class SplitSolver extends Solver {\r\n\r\n        subsolver: Solver;\r\n\r\n        constructor(subsolver: Solver);\r\n\r\n        solve(dy: number, world: World): number;\r\n\r\n    }\r\n\r\n    export class EventTarget {\r\n\r\n        addEventListener(type: string, listener: Function): EventTarget;\r\n        hasEventListener(type: string, listener: Function): boolean;\r\n        removeEventListener(type: string, listener: Function): EventTarget;\r\n        dispatchEvent(event: IEvent): IEvent;\r\n\r\n    }\r\n\r\n    export class Pool {\r\n\r\n        objects: any[];\r\n        type: any[];\r\n\r\n        release(): any;\r\n        get(): any;\r\n        constructObject(): any;\r\n\r\n    }\r\n\r\n    export class TupleDictionary {\r\n\r\n        data: {\r\n            keys: any[];\r\n        };\r\n\r\n        get(i: number, j: number): number;\r\n        set(i: number, j: number, value: number): void;\r\n        reset(): void;\r\n\r\n    }\r\n\r\n    export class Utils {\r\n\r\n        static defaults(options?: any, defaults?: any): any;\r\n\r\n    }\r\n\r\n    export class Vec3Pool extends Pool {\r\n\r\n        type: any;\r\n\r\n        constructObject(): Vec3;\r\n\r\n    }\r\n\r\n    export class NarrowPhase {\r\n\r\n        contactPointPool: Pool[];\r\n        v3pool: Vec3Pool;\r\n\r\n    }\r\n\r\n    export class World extends EventTarget {\r\n\r\n        dt: number;\r\n        allowSleep: boolean;\r\n        contacts: ContactEquation[];\r\n        frictionEquations: FrictionEquation[];\r\n        quatNormalizeSkip: number;\r\n        quatNormalizeFast: boolean;\r\n        time: number;\r\n        stepnumber: number;\r\n        default_dt: number;\r\n        nextId: number;\r\n        gravity: Vec3;\r\n        broadphase: NaiveBroadphase;\r\n        bodies: Body[];\r\n        solver: Solver;\r\n        constraints: Constraint[];\r\n        narrowPhase: NarrowPhase;\r\n        collisionMatrix: ArrayCollisionMatrix;\r\n        collisionMatrixPrevious: ArrayCollisionMatrix;\r\n        materials: Material[];\r\n        contactMaterials: ContactMaterial[];\r\n        contactMaterialTable: TupleDictionary;\r\n        defaultMaterial: Material;\r\n        defaultContactMaterial: ContactMaterial;\r\n        doProfiling: boolean;\r\n        profile: {\r\n            solve: number;\r\n            makeContactConstraints: number;\r\n            broadphaser: number;\r\n            integrate: number;\r\n            narrowphase: number;\r\n        };\r\n        subsystems: any[];\r\n        addBodyEvent: IBodyEvent;\r\n        removeBodyEvent: IBodyEvent;\r\n\r\n        getContactMaterial(m1: Material, m2: Material): ContactMaterial;\r\n        numObjects(): number;\r\n        collisionMatrixTick(): void;\r\n        addBody(body: Body): void;\r\n        addConstraint(c: Constraint): void;\r\n        removeConstraint(c: Constraint): void;\r\n        rayTest(from: Vec3, to: Vec3, result: RaycastResult): void;\r\n        remove(body: Body): void;\r\n        addMaterial(m: Material): void;\r\n        addContactMaterial(cmat: ContactMaterial): void;\r\n        step(dy: number, timeSinceLastCalled?: number, maxSubSteps?: number): void;\r\n\r\n    }\r\n\r\n    export interface IEvent {\r\n\r\n        type: string;\r\n\r\n    }\r\n\r\n    export interface IBodyEvent extends IEvent {\r\n\r\n        body: Body;\r\n\r\n    }\r\n\r\n}\r\n"
});
SupAPI.registerPlugin("typescript", "CannonBody", {
    code: "namespace Sup {\n  export namespace Cannon {\n    export function getWorld() { return SupEngine.Cannon.World; }\n    export function resetWorld() { SupEngine.Cannon.World = new window.CANNON.World(); }\n    export function getWorldAutoUpdate() { return SupEngine.Cannon.autoUpdate; }\n    export function setWorldAutoUpdate(autoUpdate) { SupEngine.Cannon.autoUpdate = autoUpdate; }\n\n    export class Body extends ActorComponent {\n      body: any;\n\n      constructor(actor, options) {\n        super(actor);\n        this.__inner = new SupEngine.componentClasses.CannonBody(actor.__inner);\n        if (options != null) this.__inner.setup(options);\n        this.__inner.__outer = this;\n        this.body = this.__inner.body;\n        this.actor.cannonBody = this;\n      }\n      destroy() {\n        this.body = null;\n        this.actor.cannonBody = null;\n        super.destroy();\n      }\n    }\n  }\n}\n",
    defs: "declare namespace Sup {\n  namespace Cannon {\n    function getWorld(): CANNON.World;\n    function resetWorld();\n    function getWorldAutoUpdate(): boolean;\n    function setWorldAutoUpdate(autoUpdate: boolean);\n\n    class Body extends ActorComponent {\n      body: CANNON.Body;\n\n      constructor( actor: Sup.Actor, options: any );\n    }\n  }\n}\n",
    exposeActorComponent: { propertyName: "cannonBody", className: "Sup.Cannon.Body" }
});

},{}]},{},[1]);
