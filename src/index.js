import * as common from './modules/common';
import * as modal from './modules/modal';
import * as iframemodal from './modules/iframemodal';
import * as iframepane from './modules/iframepane';
import * as dragdrop from './modules/dragdrop';
import EventHelper from './EventHelper';
import MessageHelper from './MessageHelper';
import MessageDefines from './MessageDefines';
export default {
  ...common,
  ...modal,
  ifrPane:{
    ...iframepane
  },
  ifrModal:{
    ...iframemodal
  },
  dnd:{
    ...dragdrop
  },
  EventHelper,
  MessageHelper,
  MessageDefines
}
