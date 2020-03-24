import { css } from '@emotion/core';

import theme from '../utils/theme';

export const dateTimePickerStyles = css`
  .react-datetime-picker {
    display: inline-flex;
    position: relative;
  }
  .react-datetime-picker,
  .react-datetime-picker *,
  .react-datetime-picker *:before,
  .react-datetime-picker *:after {
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .react-datetime-picker--disabled {
    background-color: #f0f0f0;
    color: #6d6d6d;
  }
  .react-datetime-picker__wrapper {
    display: flex;
    align-items: center;
    flex-grow: 1;
    flex-shrink: 0;
    border: 2px solid #ccc;
    border-radius: 4px;
  }
  .react-datetime-picker__inputGroup {
    min-width: calc(4px + (4px * 3) + 3.24em + 0.434em);
    flex-grow: 1;
    padding: 6.5px 10px;
  }
  .react-datetime-picker__inputGroup__divider {
    padding: 1px 0;
    white-space: pre;
  }
  .react-datetime-picker__inputGroup__input {
    min-width: 0.54rem;
    height: calc(98%);
    position: relative;
    padding: 1px;
    border: 0;
    background: none;
    font: inherit;
    box-sizing: content-box;
    -moz-appearance: textfield;
  }
  .react-datetime-picker__inputGroup__input::-webkit-outer-spin-button,
  .react-datetime-picker__inputGroup__input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .react-datetime-picker__inputGroup__input:invalid {
    background: rgba(255, 0, 0, 0.1);
  }
  .react-datetime-picker__inputGroup__input--hasLeadingZero {
    margin-left: -0.54rem;
    padding-left: calc(1px + 0.54em);
  }
  .react-datetime-picker__inputGroup__amPm {
    font: inherit;
    -moz-appearance: none; /* Firefox */
    -webkit-appearance: none; /* Safari and Chrome */
    appearance: none;
  }
  .react-datetime-picker__button {
    border: 0;
    background: transparent;
    padding: 4px 6px 4px 5px;
  }
  .react-datetime-picker__button:enabled {
    cursor: pointer;
  }
  .react-datetime-picker__button:enabled:hover
    .react-datetime-picker__button__icon,
  .react-datetime-picker__button:enabled:focus
    .react-datetime-picker__button__icon {
    stroke: #0078d7;
  }
  .react-datetime-picker__button:disabled .react-datetime-picker__button__icon {
    stroke: #6d6d6d;
  }
  .react-datetime-picker__button svg {
    display: inherit;
  }
  .react-datetime-picker__calendar,
  .react-datetime-picker__clock {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1;
  }
  .react-datetime-picker__calendar--closed,
  .react-datetime-picker__clock--closed {
    display: none;
  }
  .react-datetime-picker__calendar {
    width: 350px;
    max-width: 100vw;
  }
  .react-datetime-picker__calendar .react-calendar {
    border-width: thin;
  }
  .react-datetime-picker__clock {
    width: 200px;
    height: 200px;
    max-width: 100vw;
    padding: 25px;
    background-color: white;
    border: thin solid #a0a096;
  }
`;

export const calendarStyles = css`
  .react-calendar {
    width: 350px;
    max-width: 100%;
    background: white;
    border: 1px solid #a0a096;
    line-height: 1.125rem;
  }
  .react-calendar--doubleView {
    width: 700px;
  }
  .react-calendar--doubleView .react-calendar__viewContainer {
    display: flex;
    margin: -0.5rem;
  }
  .react-calendar--doubleView .react-calendar__viewContainer > * {
    width: 50%;
    margin: 0.5rem;
  }
  .react-calendar,
  .react-calendar *,
  .react-calendar *:before,
  .react-calendar *:after {
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .react-calendar button {
    margin: 0;
    border: 0;
    outline: none;
  }
  .react-calendar button:enabled:hover {
    cursor: pointer;
  }
  .react-calendar__navigation {
    height: 44px;
  }
  .react-calendar__navigation button {
    min-width: 44px;
    background: none;
  }
  .react-calendar__navigation button:enabled:hover,
  .react-calendar__navigation button:enabled:focus {
    background-color: #e6e6e6;
  }
  .react-calendar__navigation button[disabled] {
    background-color: #f0f0f0;
  }
  .react-calendar__month-view__weekdays {
    text-align: center;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 0.75rem;
  }
  .react-calendar__month-view__weekdays__weekday {
    padding: 0.5rem;
  }
  .react-calendar__month-view__weekNumbers {
    font-weight: bold;
  }
  .react-calendar__month-view__weekNumbers .react-calendar__tile {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    padding: calc(1em) calc(0.6666666666666666em);
  }
  .react-calendar__month-view__days__day--weekend {
    color: #d10000;
  }
  .react-calendar__month-view__days__day--neighboringMonth {
    color: #757575;
  }
  .react-calendar__year-view .react-calendar__tile,
  .react-calendar__decade-view .react-calendar__tile,
  .react-calendar__century-view .react-calendar__tile {
    padding: 1em 0rem;
  }
  .react-calendar__tile {
    max-width: 100%;
    text-align: center;
    padding: 0.5em 0;
    background: none;
  }
  .react-calendar__tile:disabled {
    background-color: #f0f0f0;
  }
  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus {
    background-color: #e6e6e6;
  }
  .react-calendar__tile--now {
    color: ${theme.colors.primary};
    background: transparent;
  }
  .react-calendar__tile--now:enabled:hover,
  .react-calendar__tile--now:enabled:focus {
    color: #6559f9;
    background: transparent;
  }

  .react-calendar__tile--hasActive:enabled:hover,
  .react-calendar__tile--hasActive:enabled:focus {
    background: #6559f9;
    color: white;
  }
  .react-calendar__tile--active {
    background: ${theme.colors.primary};
    color: white;
  }
  .react-calendar__tile--active:enabled:hover,
  .react-calendar__tile--active:enabled:focus {
    background: #6559f9;
    color: white;
  }
  .react-calendar--selectRange .react-calendar__tile--hover {
    background-color: #e6e6e6;
  }
`;

export const clockStyles = css`
  .react-clock {
    display: block;
    position: relative;
  }
  .react-clock,
  .react-clock *,
  .react-clock *:before,
  .react-clock *:after {
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .react-clock__face {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border: 1px solid black;
    border-radius: 50%;
  }
  .react-clock__hand {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    right: 50%;
  }
  .react-clock__hand__body {
    position: absolute;
    background-color: black;
    transform: translateX(-50%);
  }
  .react-clock__mark {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    right: 50%;
  }
  .react-clock__mark__body {
    position: absolute;
    background-color: black;
    transform: translateX(-50%);
  }
  .react-clock__mark__number {
    position: absolute;
    left: -40px;
    width: 80px;
    text-align: center;
  }
  .react-clock__second-hand__body {
    background-color: red;
  }
`;
