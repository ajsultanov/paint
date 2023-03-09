# ADAM PAINT


### things
- canvas
- context
--
- keyboard shortcuts
- efficient updating
- circles
- lines
- Math.random() * (max - min) + min;

## features
##### basics to implement
- save/load
- undo
  - take previous state and create a new object that contains just the differences between the old state and new state? so not storing entire state in memory for each history step
- eraser/alpha brush
- grid
  - overlap with cells or gap?
- zoom
  - 25% - 400% ~~?
- select
  - rectangle
  - lasso
  - wand
  - SUPER WAND! cross between wand and lasso
    - select color, moving selects only that overlap with that color/interconnected cells of that color, or a range of color
- hold shift(or other meta) to halftone while drawing? maybe neat
- color -> select all, edit in place via color tools
- click & drag to select tool from popup menu

#### from other programs i like
- pyxel edit
  - tile tool
    - select and draw (paste)
    - save to auto-update
  - offset tool
  - ...
- aseprite
  - opens any image file
  - ...

#### that i dont like
- pyxel edit
  - tile tool:
    - hard to tell which tiles are saved from afar
    - moving mapped tiles impossible
  - line tool:
    - makes weird/unintuitive jaggies
  - file handling:
    - must import/export non-.pyxel files
    - no keyboard shortcuts
  - color tools:
    - no dedicated window thing
    - bad rgb input
- aseprite
  - big chunky ui
  - hex input is fucked
  - awkward palette tools
  - awkward, finicky selection handling

#### toolbars
aseprite:
-marquee
  - marquee (rect)
  - marquee (ellipse)
  - lasso (free)
  - lasso (poly)
  - wand
- pencil
  - pencil
  - spray
- eraser
- dropper
- zoom
  - zoom
  - hand
- move
  - move
  - slice
- fill
  - fill
  - gradient
- line
  - line
  - curve
- shape
  - rect (line)
  - rect (fill)
  - ellipse (line)
  - ellipse (fill)
- shape2
  - contour
  - polygon
- blur
  - blur
  - jumble

pyxel edit (handles complexities with menu radio buttons etc):
- selection
- wand
- pen
- eraser
- rect
- ellipse
- fill
- color replacer
- dropper
- tile placer
- offset
- anim frame range
- anim frame mgr
- pan
- zoom
- zoom-fit
- max-center frame
- undo
- redo
- needed to update a thing here


[EJ link](https://eloquentjavascript.net/19_paint.html)
