Could you clarify how you expect multiple parents to be represented in the flow data?

- Should the main tree (used for layout and `toJSON()`/`upload()`) still assume a single primary parent, with extra parent links stored elsewhere (perhaps in the connectors list)?
- When a second parent is linked via a manual connector, do you want the layout to change, or stay as-is and rely on the connector line as the indicator?
- For persistence: when reloading from JSON, how should those extra parent relationships be restored?
