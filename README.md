# Dmitry's demo for Magic Leap

Please follow the following instructions to get the app running:

1. Make sure you're running at least Node LTS. Easiest way to do that is with [nvm](https://github.com/creationix/nvm): `nvm use --lts`
2. `npm install`
3. `npm start`
4. Once Webpack is done building (10-15s), go to http://localhost:8091

This demo consists of a React + Redux app. I decided to use React because I think it's particularly well-suited to modularity. A frontend experience
that manages an inventory of products and a showroom to show them off lends itself well to being built in a modular way. I decided to go with Redux
as a way of getting the infrastructure in place for scalability down the line. React's built-in state magagement (via props and `setState`) would certainly have gotten the job done for this simple demo. But in my experience it pays off to lay down a foundation that scales well. When the scale does come, it will be much more tenable to manage it. I like Redux - keeping state immutable and state-altering functions pure is a win.

The React + Redux app is wrapped in a basic Node server that serves up the assets. I'm using Webpack to take care of bundling and transpiling with Babel (most of the app is written in ES6). There's also a hot reloading module to speed up the workflow. The styling is broken up into SCSS components.

I use D3 for some basic path-drawing to give the dashboard a bit of a sci-fi feel. Note that the app is currently not very responsive. This is by design - I focused most of my time on the interactive element that shows off the products.

## Showing off the goods
To really show off the ships in our inventory, I'm using the [Three.js](https://github.com/mrdoob/three.js) library. This library takes an object and a textures file and uses WebGL to render the 3d model. I'm using a Blender model of a racing pod. You will notice that there are two main components to the dashboard - the "Inventory" view on the left and the "Showroom" view on the right. As a ship is selected from the former, it will be rendered in all its triplicate glory.

## However...
This is not what I spent most of the time building. Using JavaScript to manipulate and render 3D models is mighty convenient, but is neither efficient nor performant. The browser is doing a lot of work parsing the JS, optimizing, compiling, repotimizing, deoptimizing, executing, and garbage collecting. This results in diminished FPS and quite a load on the CPU (even with hardware acceleration). If there were only some way to frontload the work and provide the browser code that's much closer to machine code...

Enter WebAssembly. WebAssembly is a way to run code written in lower-level languages like C and C++ in the browser at near-native performance. I originally
wanted the entire showroom aspect of the dashboard to be a model rendered with C++/OpenGL, and compiled to WASM. This is what I spent most of my time building. I didn't get a full working model yet, which is why I added the Three.js version. You'll notice however that the Three.js version will get the CPU sweating fairly quickly (within 30 seconds of active panning and zooming on my machine). That's just another reason why WA would be a much better way to handle this. I do have a semi-working model that you can access at `localhost:8090/wasm`.

**NOTE**: If on Chrome, do not go to that route just yet. It will most likely crash your browser as the shaders are written in a newer GLSL spec and Emscripten has trouble parsing them. If you go to that route in Firefox however, after a few seconds Firefox asks if you want to stop the page or wait. If you click "stop" the view renders. The model doesn't show but you'll see the blue background.

The C++/WA code consists of the following:
1. `main.cpp` and four helper files to load the objects and shaders, parse the loaded files, create the controls, and create the final view.
2. the input files - `cube.obj`, `uvmap.DDS`, `TransformVertexShader.vertexshader` and `TextureFragmentShader.fragmentshader`
3. I use `emscripten` to compile the C++ to WA. The command to compile is:
```
emcc main.cpp common/shader.cpp common/controls.cpp common/texture.cpp common/objloader.cpp \
-s WASM=1 -s USE_GLFW=3 -s DEMANGLE_SUPPORT=1 -s FULL_ES3=1 \
-o test.html \
--preload-file TransformVertexShader.vertexshader \
--preload-file TextureFragmentShader.fragmentshader \
--preload-file uvmap.DDS \
--preload-file cube.obj
```
4. This will generate the following files: `test.html`, `test.js`, and `test.wasm`. The latter is the binary format that is provided to the browser and that allows for the near-native performance.

The need for a WASM solution for rendering and viewing these kinds of high-resolution models becomes all the more clear as the file size goes up. The original `.obj` file for the race pod was 100MB with nearly a million faces. Through selective decimation I reduced the faces count to less than half of that and got the file size to 30MB. It still takes Three.js about 3 seconds to load it into the `canvas` element and interacting with the model starts taxing the browser immediately (This is why I've added the "Back to inventory" button. Clicking that removes the `canvas` node from the DOM and will let your CPU cool off). I think WA is an incredibly powerful tool that will change a lot of how we write code for the browser. It's still nascent and I'm really excited to take part in its growth.

## Nice-to-haves
With more time, some things I'd like to add are:
1. A working object parser that can handle complex geometries (current parser is just an MVP).
2. Tests - unit (React) and end-to-end (proably Headless Chromium as PhantomJS is getting deprecated).
3. Update to React 16 (with Fiber!!).
4. Better error handling and conveying of errors to end user.
5. Add a Makefile to take care of library, header linking for C++ code.

## Credits
1. Blender model downloaded from [here](https://www.blendswap.com/blends/view/16414). Credit to the author.
2. X-Wing SVG downloaded from The Noun Project. Credit to [Lluisa Iborra](https://thenounproject.com/term/x-wing/892876/).
3. The simple object parser is heavily based on the one provided in [this tutorial](http://www.opengl-tutorial.org/beginners-tutorials/tutorial-7-model-loading/). Credit to the author(s).