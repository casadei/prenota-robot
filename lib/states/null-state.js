'use strict';

module.exports = class NullState {
  async execute(navigator, page) {
    return;
  }
}