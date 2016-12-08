<h1>FlowUI</h1>

<p>FlowUI is a set of common modular UI components for web and mobile-web applications. Built using ES6, SaSS, HTML5 and CSS3, FlowUI is lightweight and doesn't require any third-party frameworks or libraries.</p>

<p><strong>This project is work in progress, and not ready to be used in the wild.</strong></p>

<h2>Dialog API Reference</h2>

<h4>Dialog Properties</h4>

<table>
<tr>
  <th>Property</th>
  <th>Description</th>
  <th>Type</th>
</tr>
<tr>
  <td>title</td>
  <td>Title of dialog</td>
  <td>String</td>
</tr>
<tr>
  <td>html</td>
  <td>HTML content to inject into dialog</td>
  <td>String</td>
</tr>
<tr>
  <td>url</td>
  <td>URL to pull content from via AJAX request</td>
  <td>String</td>
</tr>
<tr>
  <td>promise</td>
  <td>Populate content of dialog from Promise</td>
  <td>Promise</td>
</tr>
<tr>
  <td>buttons</td>
  <td>Buttons to add to footer of dialog</td>
  <td>Array</td>
</tr>
<tr>
  <td>options</td>
  <td>Additional options to customize dialog</td>
  <td>Dialog Options (Object)</td>
</tr>
</table>

<h4>Dialog Options Properties</h4>

<table>
<tr>
  <th>Property</th>
  <th>Description</th>
  <th>Type</th>
</tr>
<tr>
  <td>className</td>
  <td>Class name(s) to add to dialog element</td>
  <td>String</td>
</tr>
<tr>
  <td>stackable</td>
  <td>When a new dialog is spawned, existing dialogs are closed by default. Setting stackable to true will keep previous dialog in an inactive state and will be reactivated once the current dialog is closed.</td>
  <td>Boolean</td>
</tr>
<tr>
  <td>animation</td>
  <td>Customization for dialog animate in/out effects</td>
  <td>Animation Object</td>
</tr>
<tr>
  <td>events</td>
  <td>Allows you to attached on dialog events such as onopen and onclose</td>
  <td>Events Object</td>
</tr>
</table>

<h4>Dialog Animation Properties</h4>

<table>
<tr>
  <th>Property</th>
  <th>Description</th>
  <th>Type</th>
</tr>
<tr>
  <td>in</td>
  <td>Animation to apply when first displaying dialog. Possible values include: zoomIn, fadeIn, pulseIn</td>
  <td>String</td>
</tr>
<tr>
  <td>out</td>
  <td>Animation to apply when dialog is closed. Possible values include: zoomOut, fadeOut, pulseOut</td>
  <td>String</td>
</tr>
</table>

<h4>Dialog Event Properties</h4>

<table>
<tr>
  <th>Property</th>
  <th>Description</th>
  <th>Type</th>
</tr>
<tr>
  <td>onopen</td>
  <td>Function to call when dialog is opened</td>
  <td>Function</td>
</tr>
<tr>
  <td>onclose</td>
  <td>Function to call when dialog is closed</td>
  <td>Function</td>
</tr>
</table>


<h2>Loader API Reference</h2>

<table>
<tr>
  <th>Property</th>
  <th>Description</th>
  <th>Type</th>
</tr>
<tr>
  <td>text</td>
  <td>Text to display below loader</td>
  <td>String</td>
</tr>
<tr>
  <td>parent</td>
  <td>Parent DOM element to inject loader (default is document.body)</td>
  <td>Element or Query Selector</td>
</tr>
<tr>
  <td>promise</td>
  <td>If provided loader will close when promise is resolved</td>
  <td>Promise</td>
</tr>
</table>
