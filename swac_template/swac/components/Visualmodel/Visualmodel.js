var VisualmodelFactory = {};
VisualmodelFactory.create = function (config) {
    return new Visualmodel(config);
};

/**
 * Component to create visual models from data, that shows the dependencies
 * and hierarchie within the data.
 */

class Visualmodel extends Component {

    constructor(options = {}) {
        super(options);
        this.componentName = 'Visualmodel';

        this.desc.text = "Component to create visual models from data, that shows the dependencies and hierarchie within the data.";

        this.desc.depends[0] = {
            name: "Konva libary",
            path: SWAC_config.swac_root + "/swac/components/Visualmodel/libs/konva.min.js",
            desc: ""
        };
        this.desc.depends[1] = {
            name: "Colorcalcultions algorithms",
            path: SWAC_config.swac_root + "/swac/algorithms/Colorcalculations.js",
            desc: ""
        };


        this.desc.templates[0] = {
            name: 'visualmodel',
            style: 'visualmodel',
            desc: 'standard visualmodel'
        };

        this.desc.reqPerTpl[0] = {
            selc: '.swac_visualmodel_drawarea',
            desc: "Element where to draw the visualisation"
        };

        this.desc.reqPerSet[0] = {
            name: "id",
            desc: "Id that identifies the dataset."
        };
        this.desc.reqPerSet[1] = {
            name: "name",
            alt: "title",
            desc: "Name or title of the selection."
        };

        this.desc.optPerSet[0] = {
            name: "parent",
            desc: "If present the parent information will be used for layering."
        };
        this.desc.optPerSet[1] = {
            name: "width",
            desc: "Width of the sets visualisation."
        };
        this.desc.optPerSet[2] = {
            name: "height",
            desc: "Height of the sets visualisation."
        };
        this.desc.optPerSet[3] = {
            name: "fillcolor",
            desc: "Color that is the visualisation filled with."
        };
        this.desc.optPerSet[4] = {
            name: "bordercolor",
            desc: "Color of the visualisations border."
        };
        this.desc.optPerSet[5] = {
            name: "desc",
            desc: "Visualisations description."
        };
        this.desc.optPerSet[6] = {
            name: "type",
            desc: "Visualisations type. [dev,con] default: dev"
        };
        this.desc.optPerSet[7] = {
            name: "kind",
            desc: "Visualisations kind. For con: [line,arrow] default: line"
        };
        this.desc.optPerSet[8] = {
            name: "linecalc",
            desc: "Kind of line calculation. [direct,curve] default: direct"
        };
        this.desc.optPerSet[9] = {
            name: "part1",
            desc: "Id of the dataset representing the first partner of a connection."
        };
        this.desc.optPerSet[10] = {
            name: "part2",
            desc: "Id of the dataset representing the second partner of a connection."
        };

        this.options.showWhenNoData = true;

        this.desc.opts[0] = {
            name: "defaultWidth",
            desc: "Default width of set visus when no width data is given"
        };
        if (!options.defaultWidth)
            this.options.defaultWidth = 100;
        this.desc.opts[1] = {
            name: "defaultHeight",
            desc: "Default height of set visus when no width data is given"
        };
        if (!options.defaultHeight)
            this.options.defaultHeight = 50;
        this.desc.opts[2] = {
            name: "defaultFillColor",
            desc: "Default color of the set visu if no set.fillcolor is given"
        };
        if (!options.defaultFillColor)
            this.options.defaultFillColor = null; //'#ffffff';
        this.desc.opts[3] = {
            name: "defaultStrokeColor",
            desc: "Default color of the set visus border if no set.strokecolor is given"
        };
        if (!options.defaultBorderColor)
            this.options.defaultBorderColor = '#000000';
        this.desc.opts[4] = {
            name: "visuMargin",
            desc: "Margin between the visu elements."
        };
        if (!options.visuMargin)
            this.options.visuMargin = 10;
        this.desc.opts[5] = {
            name: "conDefaultLinecalc",
            desc: "Default calculation mode used for lines of connections. [direct,curve]"
        };
        if (!options.conDefaultLinecalc)
            this.options.conDefaultLinecalc = 'curve';

        this.plugins.set('propertieseditor', {
            active: true
        });
        this.plugins.set('visucreator', {
            active: true
        });
        this.plugins.set('exporter', {
            active: true
        });

        // Attributes for internal useage
        this.layer = null;          // Konva layer where the scene is drawn
        this.stage = null;          // Stage to put the layer on
        this.drawns = new Map();    // Map with key=fromName, value = array of set visus with index same index as dataset.id
        this.visuelemFocus = null;  // visuelem that has currently focus
        this.markerinterval = null; // Intervall in which the marker will be animated
    }

    init() {
        return new Promise((resolve, reject) => {
            let contElem = this.requestor.querySelector('.swac_visualmodel_drawarea');

            // Create stage
            this.stage = new Konva.Stage({
                container: ".swac_visualmodel_drawarea",
                width: contElem.clientWidth, //window.innerWidth,
                height: 1750, //window.innerHeight,
                draggable: true
            });
            Konva.showWarnings = true;
            this.layer = new Konva.Layer();
            this.stage.add(this.layer);
            this.layer.draw();

            // Bind event handlers
            this.stage.on("wheel", this.zoom.bind(this));

            // Create visual elements for data
            for (let curSource in this.data) {
                for (let curSet of this.data[curSource]) {
                    if (curSet)
                        this.afterAddSet(curSource, curSet);
                }
            }
            this.registerScenegraphFunctions();
            resolve();
        });
    }

    /**
     * Function to reset the zoom to normal
     */
    resetZoom() {
        this.stage.scale({x: 1, y: 1});
        this.stage.position({x: 0, y: 0});
        this.stage.batchDraw();
    }

    /**
     * Function to zoom in or out on the stage
     * 
     * @param {KonvaEvent} evt Event that calls the zoom
     */
    zoom(evt) {
        var scaleBy = 0.99;
        evt.evt.preventDefault();
        var oldScale = this.stage.scaleX();
        var mousePointTo = {
            x:
                    this.stage.getPointerPosition().x / oldScale -
                    this.stage.x() / oldScale,
            y:
                    this.stage.getPointerPosition().y / oldScale -
                    this.stage.y() / oldScale
        };
        var newScale = evt.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

        this.stage.scale({x: newScale, y: newScale});
        var newPos = {
            x:
                    -(
                            mousePointTo.x -
                            this.stage.getPointerPosition().x / newScale
                            ) * newScale,
            y:
                    -(
                            mousePointTo.y -
                            this.stage.getPointerPosition().y / newScale
                            ) * newScale
        };
        this.stage.position(newPos);
        this.stage.batchDraw();
    }

    afterAddSet(fromName, set) {
        // Get label
        let label = set.title;
        if (!label) {
            label = set.name;
        }

        // Get coordinate
        let xcoord = set.x ? set.x : this.stage.width() / 2;
        let ycoord = set.y ? set.y : this.stage.height() / 2;

        // Get height and width
        let width = set.width ? set.width : this.options.defaultWidth;
        let height = set.height ? set.height : this.options.defaultHeight;

        // Get colors
        let fillcolor = set.color ? set.color : this.options.defaultFillColor;
        let bordercolor = set.bordercolor ? set.bordercolor : this.options.defaultBorderColor;
        let labelfillcolor = null;
        let labelbordercolor = null;
        if (fillcolor) {
            labelfillcolor = set.labelfillcolor ? set.labelfillcolor : Colorcalculations.calculateContrastColor(fillcolor);
            labelbordercolor = set.labelbordercolor ? set.labelbordercolor : Colorcalculations.calculateContrastColor(fillcolor);
        }

        // Get parent
        let parentDrawn = this.getParentDrawn(set);
        // Draw parent if not drawn yet
        if (parentDrawn && parentDrawn.notdrawn) {
            // Get parent set
            let parentSource = this.data[parentDrawn.fromname];
            if (parentSource) {
                let parentSet = parentSource[parentDrawn.id];
                SWAC_debug.addDebugMessage('Visualmodel', 'Now drawing parent of >'
                        + fromName + '[' + set.id + ']<', this.requestor);
                this.afterAddSet(parentDrawn.fromname, parentSet);
            } else {
                SWAC_debug.addDebugMessage('Visualmodel', 'Parent >'
                        + parentDrawn.fromname + '[' + parentDrawn.id
                        + ']< is not in available data.', this.requestor);
            }
        }

        // Define options for label
        let labOpts = {
            text: label,
            fontFamily: "Arial",
            fontStyle: "bold",
            fontSize: 14,
            padding: 2,
            strokeWidth: 0.3,
            draggable: true
        };
        if (labelfillcolor) {
            labOpts.fill = labOpts;
        }
        if (labelbordercolor) {
            labOpts.stroke = labelbordercolor;
        }

        // Create label
        let lab = new Konva.Text(labOpts);

        let drawnElem;
        if (set.type === 'con') {
            // Get starting element
            let startSet = this.data[fromName][set.part1];
            let startVisu = this.stage.find('#' + fromName + '_' + startSet.id)[0];
            let endSet = this.data[fromName][set.part2];
            let endVisu = this.stage.find('#' + fromName + '_' + endSet.id)[0];

            // Get parent of startVisu and set it as parent of con
            parentDrawn = startVisu.attrs.swac_parent;

            // Get start and end positions of partners
            let stop = startVisu.attrs.y;
            let sbottom = startVisu.attrs.y + startVisu.attrs.height;
            let sleft = startVisu.attrs.x;
            let sright = startVisu.attrs.x + startVisu.attrs.width;

            let etop = endVisu.attrs.y;
            let ebottom = endVisu.attrs.y + endVisu.attrs.height;
            let eleft = endVisu.attrs.x;
            let eright = endVisu.attrs.x + endVisu.attrs.width;

            // Check if start partner is at same hoizontal bottom-level (max. 15% difference)
            let hbdiff = sbottom - ebottom;
            let htdiff = stop - etop;
            //if (hbdiff < startVisu.attrs.height * 0.15 || htdiff < startVisu.attrs.height * 0.15) {
            let hdiff;
            let htype;
            let sp_x = startVisu.attrs.x + (startVisu.attrs.width / 2);
            let sp_y = startVisu.attrs.y;
            let ep_x = endVisu.attrs.x + (endVisu.attrs.width / 2);
            let ep_y = endVisu.attrs.y;
            // Calculate curve point
            let cp_x = sp_x + ((ep_x - sp_x) / 2);
            let cp_y = sp_y + 10;
            if (hbdiff <= htdiff) {
                hdiff = hbdiff;
                htype = 'bottom';
                sp_y += startVisu.attrs.height;
                ep_y += endVisu.attrs.height;
                cp_y += startVisu.attrs.height;
            } else {
                hdiff = htdiff;
                htype = 'top';
            }
            let posarray;

            let linecalc = this.options.conDefaultLinecalc;
            if (set.linecalc) {
                linecalc = set.linecalc;
            }

            if (linecalc === 'curve') {
                posarray = [sp_x, sp_y, cp_x, cp_y, ep_x, ep_y];
            } else {
                posarray = [sp_x, sp_y, ep_x, ep_y];
            }

            let visuOpts = {
                id: fromName + '_' + set.id,
                swac_fromName: fromName,
                swac_set: set,
                swac_childs: [],
                swac_parent: parentDrawn,
                points: posarray,
                stroke: 'red',
                strokeWidth: 1,
                lineCap: 'round',
                lineJoin: 'round',
                tension: 0.7
            };

            if (set.kind === 'arrow') {
                visuOpts.pointerLength = 10;
                visuOpts.pointerWidth = 10;
                visuOpts.pointerAtBeginning = false;
                drawnElem = new Konva.Arrow(visuOpts);
            } else {
                drawnElem = new Konva.Line(visuOpts);
            }
        } else {
            // Define options for display
            let visuOpts = {
                id: fromName + '_' + set.id,
                swac_fromName: fromName,
                swac_set: set,
                swac_childs: [],
                swac_parent: parentDrawn,
                text: lab,
                x: xcoord,
                y: ycoord,
                width: width,
                height: height,
                scaleX: 1,
                scaleY: 1,
                stroke: bordercolor,
                strokeWidth: 1
            };
            // If no image is given fill with color
            if (!set.image && fillcolor) {
                visuOpts.fill = fillcolor;
            }
            if (set.desc) {
                visuOpts.desc = set.desc;
            }

            drawnElem = new Konva.Rect(visuOpts);
        }

        // Add visu to layer
        this.layer.add(drawnElem);

        // Set labels position
        lab.attrs.x = drawnElem.attrs.x + 2;
        lab.attrs.y = drawnElem.attrs.y + 2;
        // Add label to layer
        this.layer.add(lab);

        // Fill with image if given
        if (set.image) {
            let layer = this.layer;
            let imageObj = new Image();
            imageObj.onload = function () {
                drawnElem.fillPatternImage(imageObj);
                layer.draw();
            };
            imageObj.src = set.image;
        }

        if (parentDrawn) {
            // Note created child
            parentDrawn.attrs.swac_childs.push(drawnElem);
            // Calculate relative position
            drawnElem.swac_rel_x = drawnElem.attrs.x - parentDrawn.attrs.x;
            drawnElem.swac_rel_y = drawnElem.attrs.y - parentDrawn.attrs.y;
        }

        // Set the level where to draw the set
        if (parentDrawn) {
            drawnElem.setZIndex(parentDrawn.index + 1);
        }


        // Create drawns storage if not exists
        if (!this.drawns.has(fromName)) {
            this.drawns.set(fromName, []);
        }
        let drawnStorage = this.drawns.get(fromName);
        drawnStorage[set.id] = drawnElem;

        // ***************
        // Register event handlers for visuelem<
        // ***************

        let stage = this.stage;
        // Prevent stage from be dragged when on visuelem
        drawnElem.on("mouseenter", function (e) {
            if (e.target === drawnElem) {
                stage.draggable(false);
            }
        });
        // Set stage to be draggable again so that user can move over whole drawing
        drawnElem.on("mouseleave", function (e) {
            if (e.target === drawnElem) {
                if (this.focusObject === null) {
                    stage.draggable(true);
                }
            }
        });
        //drawnElem.strokeScaleEnabled(false);

        // When dragging
        let thisRef = this;
        drawnElem.on("dragmove", function () {
            // Move label along
            lab.position({
                x: drawnElem.attrs.x + 2,
                y: drawnElem.attrs.y + 2
            });
            // Update relative position
            if (drawnElem.attrs.swac_parent) {
                drawnElem.swac_rel_x = drawnElem.attrs.x - drawnElem.attrs.swac_parent.attrs.x;
                drawnElem.swac_rel_y = drawnElem.attrs.y - drawnElem.attrs.swac_parent.attrs.y;
            }

            // Move childs along
            thisRef.moveChilds(drawnElem);
        });
        drawnElem.draggable(true);
        lab.on('dragstart', function () {
            lab.stopDrag();
            drawnElem.startDrag();
        });

        this.stage.add(this.layer);
        this.layer.draw();
    }

    afterRemoveSets(fromName, sets) {
        for (let curSet of sets) {
            let id = fromName + '_' + curSet.id;
            let drawn = this.stage.find('#' + id)[0];
            // Also delete text label
            drawn.attrs.text.destroy();
            // Also delete childs
            for (let curChild of drawn.attrs.swac_childs) {
                let fromName = curChild.attrs.swac_set.swac_fromName;
                let id = curChild.attrs.swac_set.id;
                this.requestor.swac_comp.removeSets(fromName, id);
            }

            // Auch Beschrifung und Kinder löschen!
            drawn.destroy();
        }
        this.layer.draw();
    }

    /**
     * Gets the drawn of the parent set
     * 
     * @param {Object} set Childset where to get the parentdrawn for
     * @returns {Object} Parents drawn object, contains notdrawn=true if not drawn yet. null if there is no parent
     */
    getParentDrawn(set) {
        if (!set.parent)
            return null;
        // Get parent information
        let parent_fromname = SWAC_model.getSetnameFromRefernece(set.parent);
        let parent_id = SWAC_model.getIdFromReference(set.parent);

        // Check if parent exists in draw storeage
        let parentsStore = this.drawns.get(parent_fromname);
        if (parentsStore) {
            if (parentsStore[parent_id]) {
                return parentsStore[parent_id];
            } else {
                SWAC_debug.addDebugMessage('Visualmodel', 'Drawn for >' + parent_fromname + '[' + parent_id + ']< not found.');
            }
        } else {
            SWAC_debug.addDebugMessage('Visualmodel',
                    'Could not find parent storage >' + parent_fromname + '<',
                    this.requestor);
        }
        // Return not drawn information
        return {
            notdrawn: true,
            fromname: parent_fromname,
            id: parent_id
        };
    }

    /**
     * Positions the child visuelems in relation to their parent visuelem
     * 
     * @param {Object} visuelem Visualisation element which childs should be moved
     * @returns {undefined}
     */
    moveChilds(visuelem) {
        for (let curChild of visuelem.attrs.swac_childs) {
            // Move child
            curChild.position({
                x: visuelem.attrs.x + curChild.swac_rel_x,
                y: visuelem.attrs.y + curChild.swac_rel_y
            });
            // Move childs label
            if (curChild.attrs.text) {
                curChild.attrs.text.position({
                    x: curChild.attrs.x + 5,
                    y: curChild.attrs.y + 5
                });
            }
            this.moveChilds(curChild);
        }
    }

    /****************************
     * SCENE GRAPH FUNCTIONS
     ****************************/

    /**
     * Register functions for scene graph useage
     * 
     * @returns {undefined}
     */
    registerScenegraphFunctions() {
        let sgElem = this.requestor.querySelector('.swac_visualmodel_scenegraph');
        let aElems = sgElem.querySelectorAll('a:not([swac_id="{id}"])');
        for (let curAElem of aElems) {
            curAElem.addEventListener('click', this.onClickScenegraphElem.bind(this));
        }
    }

    /**
     * Function that should be executed, when a element within scene graph is 
     * clicked. Selectes the visual element on screen and animates its positon
     * so it can be found easyly.
     * 
     * @param {DOMEvent} evt Event calling the function
     * @returns {undefined}
     */
    onClickScenegraphElem(evt) {
        // Unselect previous selected
        this.stage.find("Transformer").destroy();
        // Reset marker interval
        if (this.markerinterval) {
            window.clearInterval(this.markerinterval);
            this.markerinterval = null;
        }
        // Get element with swac_id
        let idElem = evt.target;
        while (idElem.parentNode) {
            if (idElem.hasAttribute('swac_setid')) {
                break;
            }
            idElem = idElem.parentNode;
        }
        let id = idElem.getAttribute('swac_setid');
        let setname = idElem.getAttribute('swac_setname');
        let visuelem = this.stage.findOne('#' + setname + '_' + id);

        var tween;
        if (tween) {
            tween.destroy();
        }

        tween = new Konva.Tween({
            node: visuelem,
            duration: 2,
            scaleX: 1.5,
            scaleY: 1.5,
            easing: Konva.Easings.ElasticEaseOut,
        });
        // Direct animation
        tween.play();
        setTimeout(function () {
            tween.reverse();
        }, 1000);
        // Repeating timed animation
        this.markerinterval = setInterval(function () {
            tween.play();
            setTimeout(function () {
                tween.reverse();
            }, 1000);
        }, 3000);
        // Stop animation on click onto stage
        let thisRef = this;
        this.stage.on("click", function () {
            if (thisRef.markerinterval) {
                window.clearInterval(thisRef.markerinterval);
                thisRef.markerinterval = null;
            }
        });
    }
}