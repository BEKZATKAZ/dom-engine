import { Camera } from "camera";
import { float2, hex } from "low-level";
import { GameObject } from "game-object";
import { ProblematicComponent } from "./problematic-component";
import { World, WorldManager } from "worlds";
import type { Mock } from "vitest";

let camera: Camera;
let world: World;

let cameraStartSpy: Mock<() => void>;
let cameraUpdateSpy: Mock<() => void>;
let cameraDestroySpy: Mock<() => void>;

let worldUpdateSpy: Mock<() => void>;
let worldDestroySpy: Mock<() => void>;

beforeEach(() => {
  camera = new Camera({
    backgroundColor: hex("#000"),
    size: 10
  });

  world = WorldManager.load(new World());
  world.createEmptyObject().addComponent(camera);

  cameraStartSpy = vi.spyOn(camera, "onStart");
  cameraUpdateSpy = vi.spyOn(camera, "update");
  cameraDestroySpy = vi.spyOn(camera, "onDestroy");

  worldUpdateSpy = vi.spyOn(world, "update");
  worldDestroySpy = vi.spyOn(world, "destroy");
});

afterEach(() => {
  WorldManager.unload(world);
});

describe("World management", () => {
  describe("load()", () => {
    it("pushes a world to the internal array", () => {
      WorldManager.load(new World());
      assert.strictEqual(WorldManager.loadedWorldCount, 2, "There should be 2 worlds now");
    });

    it("throws if the same world was added", () => {
      assert.throws(() => WorldManager.load(world));
    });
  });

  describe("unload()", () => {
    it("deletes the target world and destroys all its objects", () => {
      WorldManager.unload(world);
      expect(cameraDestroySpy).toHaveBeenCalledOnce();
      expect(worldDestroySpy).toHaveBeenCalledOnce();
    });

    it("can be called only once and does nothing if called again", () => {
      for (let i = 0; i < 5; i++) WorldManager.unload(world);
      world.destroy();

      expect(cameraDestroySpy).toHaveBeenCalledOnce();
      expect(worldDestroySpy).toHaveBeenCalledTimes(2); // unload + extra destroy
    });

    it("does not affect others if an error was thrown in an object", () => {
      camera.gameObject.addComponent(new ProblematicComponent());
      assert.doesNotThrow(() => WorldManager.unload(world));
      expect(cameraDestroySpy).toHaveBeenCalledOnce();
    });
  });
});

describe("Object management", () => {
  test("addObject()", () => {
    world.addObject(new GameObject({ position: float2(0, 10) }));
    world.update();
    expect(cameraStartSpy).toHaveBeenCalledOnce();
  });

  describe("destroyObject()", () => {
    it("deletes the target object and calls onDestroy()", () => {
      world.destroyObject(camera.gameObject);
      expect(cameraDestroySpy).toHaveBeenCalledOnce();

      world.update();
      expect(cameraStartSpy).not.toHaveBeenCalled();
    });

    it("does nothing if the target object does not exist", () => {
      world.destroyObject(new GameObject());
      expect(cameraDestroySpy).not.toHaveBeenCalled();
    });
  });
});

describe("Updates", () => {
  test("getActiveCameras() returns an iterable of all active cameras", () => {
    WorldManager.update();
    const cameras = [...WorldManager.getActiveCameras()];

    assert.strictEqual(cameras.length, 1, "Don't we have only one camera?");
    assert.strictEqual(cameras[0], camera, "Reference change");
  });

  it("calls update() on all loaded worlds", () => {
    for (let i = 0; i < 10; i++) WorldManager.update();

    expect(cameraStartSpy).toHaveBeenCalledOnce();
    expect(cameraUpdateSpy).toHaveBeenCalledTimes(10);
    expect(worldUpdateSpy).toHaveBeenCalledTimes(10);

    const activeCamera = world.getActiveCameraOrNull();
    assert.strictEqual(activeCamera, camera, "Active camera should always update");
  });

  it("does not affect others if an error was thrown in an object", () => {
    camera.gameObject.addComponent(new ProblematicComponent());
    assert.doesNotThrow(() => WorldManager.update());
    expect(cameraUpdateSpy).toHaveBeenCalledOnce();
  });

  it("does not call update() on inactive objects", () => {
    camera.gameObject.active = false;
    for (let i = 0; i < 10; i++) WorldManager.update();
    expect(cameraUpdateSpy).not.toHaveBeenCalled();

    camera.gameObject.active = true;
    WorldManager.update();
    expect(cameraUpdateSpy).toHaveBeenCalledOnce();
  });

  it("does not call update() on objects if the world is already destroyed", () => {
    world.destroy();
    for (let i = 0; i < 10; i++) WorldManager.update();
    expect(cameraUpdateSpy).not.toHaveBeenCalled();
  });
});
