# ICE Lab simulation configuration

One engine (`engine.js`) runs every device. Each device is a configuration file written from its ICE Lab manual. The configuration holds:

- the machine's controls
- its instruments
- the manual's procedure steps, each checked against the simulated machine
- the manual's results tables
- the manual's equations and charts

## Files

| File | Devices | Manual |
|---|---|---|
| `engine.js` | The system: main loop, procedure checks, recording, calculated columns, charts, calibration (span and zero), warnings, time speed-up | n/a |
| `kit.js` | Helpers, water density and c_p (TD360 Eq 1.6 and 1.7), water viscosity | n/a |
| `dev_h52.js` | H52 Series and Parallel Pumps | Series and Parallel Pumps (H52) |
| `dev_fluids.js` | H11 Centre of Pressure | Centre of Pressure Apparatus (H11) |
| | Bernoulli Venturi | Flow Measurement – Bernoulli Venturi |
| | H314 Hydrostatics and Properties of Fluids | Hydrostatics and Properties of Fluids (H314) |
| | H314B Hare's Tube | Hares Tube (H314B) |
| | H8 Impact of a Jet | Impact of a Jet (H8) |
| | H16 Losses in Pipe Systems | Losses in Pipe Systems (H16) |
| `dev_thermo.js` | TM1016V Free and Forced Vibrations | TM1016V |
| | TD360 Heat Exchanger Service Module | TD360 |
| | TD1002A Linear Heat Conduction | TD1002 |
| | TD1060V Steam Turbine Power Plant | TD1060V |
| `dev_materials.js` | Charpy | Pendulum Impact Testing Machine |
| | PA Hilton Torsion | Torsion Test Apparatus |
| | MTS UTM | MTS Universal Testing Machine |
| | HSM19D Rotating Fatigue | Rotating Fatigue Testing Machine |
| | Vickers | Vickers Microhardness Testing System |
| | Metallography (cutter, mounting press, polisher, microscope) | METCO / Microscope (one shared document) |
| `dev_plc.js` | CE111 with the CE123 PLC Trainer: a working PLC that runs the student's instruction-list program | PLC Process Trainer (CE111), Chapter 11 |

## How a device file is written

```js
LAB.def({
  id, on3d,               // device id and the 3D model(s) it drives
  title, manual, about,
  constants: [],          // values and equations taken from the manual
  assume: [],             // values the manual does not give, used by the simulation
  issues: [],             // mistakes or gaps found in the manual
  init(),                 // starting state of the machine
  step(s, dt),            // physics, run every 50 ms of machine time
  controls: [],           // toggle / range / select / button
  readings: [],           // instruments: label, unit, decimals, noise, resolution
  warnings: [],           // the manual's safety notes, shown when they apply
  experiments: [{
    title, aim,
    steps: [{t, check, rec}],  // procedure text; check() ticks the step from the machine state
    table: [],                 // results table columns; from() copies a reading into the row
    calc: [],                  // calculated columns (the manual's equations)
    guard,                     // refuses a reading when the machine isn't in the right state
    summary,                   // fits and averages under the table
    charts: []                 // the manual's charts
  }],
  sync, post              // move the 3D model to match the simulation
})
```

Each person's recorded results and calibration settings stay in their own browser, separately for each device.

## On the website

`bench.html` (the Virtual Bench) includes these files. On each bench that has a manual, a **Lab manual mode / Free bench** switch sits next to the device menu:

- In **Lab manual mode** the configuration runs the machine and the bench drawing or 3D model follows it (`bench_bridge.js`).
- **Free bench** is the original bench.

After changing any file here, run `python3 manual-sim/build.py`.

## 3D models

`models3d/` holds the new 3D models of the devices, built from the lab photos. `build.py` puts them on the matching benches as the **3D bench** view; **Schematic** shows the 2D drawing.

- In Lab manual mode the 3D model follows the simulation.
- In Free bench it follows the bench controls.
