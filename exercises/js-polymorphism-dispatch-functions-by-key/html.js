import stringify from './html.js';

const hrTag = {
  name: 'hr',
  class: 'px-3',
  id: 'myid',
  tagType: 'single',
};
const html = stringify(hrTag); // <hr class="px-3" id="myid">

const divTag = {
  name: 'div',
  tagType: 'pair',
  body: 'text2',
  id: 'wow',
};
const html = stringify(divTag); // <div id="wow">text2</div>

const emptyDivTag = {
  name: 'div',
  tagType: 'pair',
  body: '',
  id: 'empty',
};
const html = stringify(emptyDivTag); // <div id="empty"></div>

const tagWithAttr = {
  name: 'div',
  tagType: 'pair',
  body: '',
  id: 'withAttr',
  someAttr: 'value',
};
const html = stringify(tagWithAttr); // <div id="withAttr" someAttr="value"></div>