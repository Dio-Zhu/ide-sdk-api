import * as common from './modules/common';
import * as modal from './modules/modal';
import * as iframemodal from './modules/iframemodal';
import * as iframepane from './modules/iframepane';
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
  EventHelper,
  MessageHelper,
  MessageDefines
}
