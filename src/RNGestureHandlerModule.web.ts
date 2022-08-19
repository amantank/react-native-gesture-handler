import { ActionType } from './ActionType';

//GestureHandlers
import InteractionManager from './web/tools/InteractionManager';
import NodeManager from './web/tools/NodeManager';
import PanGestureHandler from './web/handlers/PanGestureHandler';
import TapGestureHandler from './web/handlers/TapGestureHandler';
import LongPressGestureHandler from './web/handlers/LongPressGestureHandler';
import PinchGestureHandler from './web/handlers/PinchGestureHandler';
import RotationGestureHandler from './web/handlers/RotationGestureHandler';
import FlingGestureHandler from './web/handlers/FlingGestureHandler';
import NativeViewGestureHandler from './web/handlers/NativeViewGestureHandler';

//Hammer Handlers
import * as HammerNodeManager from './web_hammer/NodeManager';
import HammerNativeViewGestureHandler from './web_hammer/NativeViewGestureHandler';
import HammerPanGestureHandler from './web_hammer/PanGestureHandler';
import HammerTapGestureHandler from './web_hammer/TapGestureHandler';
import HammerLongPressGestureHandler from './web_hammer/LongPressGestureHandler';
import HammerPinchGestureHandler from './web_hammer/PinchGestureHandler';
import HammerRotationGestureHandler from './web_hammer/RotationGestureHandler';
import HammerFlingGestureHandler from './web_hammer/FlingGestureHandler';
import { Config } from './web/interfaces';
import { isExperimentalWebImplementationEnabled } from './EnableExperimentalWebImplementation';

export const Gestures = {
  NativeViewGestureHandler,
  PanGestureHandler,
  TapGestureHandler,
  LongPressGestureHandler,
  PinchGestureHandler,
  RotationGestureHandler,
  FlingGestureHandler,
};

export const HammerGestures = {
  NativeViewGestureHandler: HammerNativeViewGestureHandler,
  PanGestureHandler: HammerPanGestureHandler,
  TapGestureHandler: HammerTapGestureHandler,
  LongPressGestureHandler: HammerLongPressGestureHandler,
  PinchGestureHandler: HammerPinchGestureHandler,
  RotationGestureHandler: HammerRotationGestureHandler,
  FlingGestureHandler: HammerFlingGestureHandler,
};

const interactionManager = new InteractionManager();

export default {
  // Direction,
  handleSetJSResponder(tag: number, blockNativeResponder: boolean) {
    console.warn('handleSetJSResponder: ', tag, blockNativeResponder);
  },
  handleClearJSResponder() {
    console.warn('handleClearJSResponder: ');
  },
  createGestureHandler<T>(
    handlerName: keyof typeof Gestures,
    handlerTag: number,
    config: T
  ) {
    if (isExperimentalWebImplementationEnabled()) {
      if (!(handlerName in Gestures)) {
        throw new Error(
          `react-native-gesture-handler: ${handlerName} is not supported on web.`
        );
      }

      const GestureClass = Gestures[handlerName];
      NodeManager.createGestureHandler(handlerTag, new GestureClass());
      interactionManager.configureInteractions(
        NodeManager.getHandler(handlerTag),
        (config as unknown) as Config
      );
    } else {
      if (!(handlerName in HammerGestures)) {
        throw new Error(
          `react-native-gesture-handler: ${handlerName} is not supported on web.`
        );
      }

      const GestureClass = HammerGestures[handlerName];
      HammerNodeManager.createGestureHandler(handlerTag, new GestureClass());
    }

    this.updateGestureHandler(handlerTag, (config as unknown) as Config);
  },
  attachGestureHandler(
    handlerTag: number,
    newView: number,
    _actionType: ActionType,
    propsRef: React.RefObject<unknown>
  ) {
    if (isExperimentalWebImplementationEnabled()) {
      NodeManager.getHandler(handlerTag).init(newView, propsRef);
    } else {
      HammerNodeManager.getHandler(handlerTag).setView(newView, propsRef);
    }
  },
  updateGestureHandler(handlerTag: number, newConfig: Config) {
    if (isExperimentalWebImplementationEnabled()) {
      NodeManager.getHandler(handlerTag).updateGestureConfig(newConfig);

      interactionManager.configureInteractions(
        NodeManager.getHandler(handlerTag),
        newConfig
      );
    } else {
      HammerNodeManager.getHandler(handlerTag).updateGestureConfig(newConfig);
    }
  },
  getGestureHandlerNode(handlerTag: number) {
    if (isExperimentalWebImplementationEnabled()) {
      return NodeManager.getHandler(handlerTag);
    } else {
      return HammerNodeManager.getHandler(handlerTag);
    }
  },
  dropGestureHandler(handlerTag: number) {
    if (isExperimentalWebImplementationEnabled()) {
      NodeManager.dropGestureHandler(handlerTag);
    } else {
      HammerNodeManager.dropGestureHandler(handlerTag);
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  flushOperations() {},
};
