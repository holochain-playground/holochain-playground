import { css } from 'lit-element';

export const sharedStyles = css`
  .row {
    display: flex;
    flex-direction: row;
  }
  .column {
    display: flex;
    flex-direction: column;
  }
  .fill {
    flex: 1;
  }

  .center-content {
    align-items: center;
    justify-content: center;
    display: flex;
  }

  h3 {
    margin-block-start: 0;
  }

  .title {
    font-size: 20px;
  }

  .placeholder {
    opacity: 0.6;
  }

  .flex-scrollable-parent {
    position: relative;
    display: flex;
    flex: 1;
  }

  .flex-scrollable-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .flex-scrollable-x {
    max-width: 100%;
    overflow-x: auto;
  }
  .flex-scrollable-y {
    max-height: 100%;
    overflow-y: auto;
  }

  .json-info {
    padding: 4px;
    max-width: 400px;
  }

  .block-card {
    width: auto;
    position: relative;
    flex: 1;
  }

  .block-title {
    margin-left: 16px;
    margin-top: 16px;
    font-size: 20px;
  }

  .block-help {
    position: absolute;
    right: 8px;
    top: 8px;
  }

  .horizontal-divider {
    background-color: grey;
    height: 1px;
    opacity: 0.3;
    margin-bottom: 0;
    width: 100%;
  }
  .vertical-divider {
    background-color: grey;
    width: 1px;
    height: 100%;
    opacity: 0.3;
    margin-bottom: 0;
  }
`;