export declare const graphStyles = "\nnode {\n  background-color: grey;\n  font-size: 10px;\n  width: 16px;\n  label: data(label);\n  height: 16px;\n  shape: round-rectangle;\n}\n\nnode > node {\n  height: 1px;\n}\n\nedge {\n  width: 2;\n  target-arrow-shape: triangle;\n  curve-style: bezier;\n}\n\nedge[label] {\n  label: data(label);\n  font-size: 7px;\n  text-rotation: autorotate;\n  text-margin-x: 0px;\n  text-margin-y: -5px;\n  text-valign: top;\n  text-halign: center;        \n}\n\n.selected {\n  border-width: 1px;\n  border-color: black;\n  border-style: solid;\n}\n\n.AgentId {\n  background-color: lime;\n}\n.Create {\n  background-color: blue;\n}\n.Delete {\n  background-color: red;\n}\n.Update {\n  background-color: cyan;\n}\n.CreateLink {\n  background-color: purple;\n}\n.DeleteLink {\n  background-color: purple;\n}\n\n.implicit {\n  width: 1;\n  line-style: dotted;\n}\n\n.update-edge {\n  width: 1;\n  line-style: dashed;\n}\n.updated {\n  opacity: 0.5;\n}\n.deleted {\n  opacity: 0.3 !important;\n}\n";
