# Pages, Overlays and Partials
The framework supports [jade](http://jade-lang.com/) templates. The framework users three types of template. Pages for static views, overlays for compositing and partials for modifying overlays during game pay.

All views live in the `/game/views` folder.

## Pages
Static pages live in this folder. In multi-mode games need an index page. By default the index page that ships with the framework displays. If you place an index page in the `/game/views/pages` then that displays instead.

## Overlays
As a rule, the framework prefers text and HUD aspects of the UI to be HTML and CSS. The framework achieve through compositing. A canvas layer for WebGL code. A HTML overlay for text and HUD elements.

The framework allocates a div for your overlay.

In your [view logic](/view-logic) use the following code:

```javascript
var template = require('views/overlays/easy.jade');
$('#overlay').append(template());
```

## Partials
A partial is a reusable chunk of HTML code. Parameters allow you to tailor the rendered HTML.

The template below has two parameters: id and score.

```jade
li(class="prior-score", id="#{id}") #{score}
```

This javascript loads the template and adds it to the view. The loaded template can called again with different values. The javascript to belongs in your [view logic](/view-logic)

```javascript
var template = require('views/partials/priorScores.jade');
$('#prior-scores').append(template({id: 'prior-score-1', score: "29"}));
$('#prior-scores').append(template({id: 'prior-score-2', score: "56"}));
```