/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails react-core
 */

'use strict';

let React;
let ReactFeatureFlags;
let ReactDOMServer;

describe('ReactDOMServerLifecycles', () => {
  beforeEach(() => {
    ReactFeatureFlags = require('shared/ReactFeatureFlags');
    ReactFeatureFlags.warnAboutDeprecatedLifecycles = true;

    React = require('react');
    ReactDOMServer = require('react-dom/server');
  });

  afterEach(() => {
    jest.resetModules();
  });

  it('should not invoke cWM if static gDSFP is present', () => {
    class Component extends React.Component {
      state = {};
      static getDerivedStateFromProps() {
        return null;
      }
      componentWillMount() {
        throw Error('unexpected');
      }
      render() {
        return null;
      }
    }

    expect(() => ReactDOMServer.renderToString(<Component />)).toWarnDev(
      'Component: componentWillMount() is deprecated and will be removed in the next major version.',
    );
  });

  // TODO (RFC #6) Merge this back into ReactDOMServerLifecycles-test once
  // the 'warnAboutDeprecatedLifecycles' feature flag has been removed.
  it('should warn about deprecated lifecycle hooks', () => {
    class Component extends React.Component {
      componentWillMount() {}
      render() {
        return null;
      }
    }

    expect(() => ReactDOMServer.renderToString(<Component />)).toWarnDev(
      'Warning: Component: componentWillMount() is deprecated and will be removed ' +
        'in the next major version.',
    );

    // De-duped
    ReactDOMServer.renderToString(<Component />);
  });

  describe('react-lifecycles-compat', () => {
    const polyfill = require('react-lifecycles-compat');

    it('should not warn about deprecated cWM/cWRP for polyfilled components', () => {
      class PolyfilledComponent extends React.Component {
        state = {};
        static getDerivedStateFromProps() {
          return null;
        }
        render() {
          return null;
        }
      }

      polyfill(PolyfilledComponent);

      ReactDOMServer.renderToString(<PolyfilledComponent />);
    });
  });
});
