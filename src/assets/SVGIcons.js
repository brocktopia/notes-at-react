import React from 'react';

export function AddItemIcon(props) {
  return <svg viewBox="0 0 24 24" className={props.className ? props.className : 'svg-icon'}>
    <title>{props.title}</title>
    <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
    <path d="M0 0h24v24H0z" fill="none"/>
  </svg>
}

export function DeleteItemIcon(props) {
  return <svg viewBox="0 0 24 24" className={props.className ? props.className : 'svg-icon'}>
    <title>{props.title}</title>
    <path fill="none" d="M0 0h24v24H0V0z"/>
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"/>
    <path fill="none" d="M0 0h24v24H0z"/>
  </svg>
}

export function EditItemIcon(props) {
  return <svg viewBox="0 0 24 24" className={props.className ? props.className : 'svg-icon'}>
    <title>{props.title}</title>
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
    <path d="M0 0h24v24H0z" fill="none"/>
  </svg>
}

export function ListIcon(props) {
  return <svg viewBox="0 0 24 24" className={props.className ? props.className : 'svg-icon'}>
    <title>{props.title}</title>
    <path d="M4 14h4v-4H4v4zm0 5h4v-4H4v4zM4 9h4V5H4v4zm5 5h12v-4H9v4zm0 5h12v-4H9v4zM9 5v4h12V5H9z"/>
    <path d="M0 0h24v24H0z" fill="none"/>
  </svg>
}

export function MapIcon(props) {
  return <svg viewBox="0 0 24 24" className={props.className ? props.className : 'svg-icon'}>
    <title>{props.title}</title>
    <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/>
    <path d="M0 0h24v24H0z" fill="none"/>
  </svg>
}

export function PlaceIcon(props) {
  return <svg viewBox="0 0 24 24" className={props.className ? props.className : 'svg-icon'}>
    <title>{props.title}</title>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    <path d="M0 0h24v24H0z" fill="none"/>
  </svg>
}

export function LocationIcon(props) {
  return <svg viewBox="0 0 24 24" className={props.className ? props.className : 'svg-icon'} onClick={props.onClick}>
    <title>{props.title}</title>
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
  </svg>
}

export function CloseIcon(props) {
  return <svg viewBox="0 0 24 24" className={props.className ? props.className : 'svg-icon'}>
    <title>{props.title}</title>
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
    <path d="M0 0h24v24H0z" fill="none"/>
  </svg>
}

export function LaunchIcon(props) {
  return <svg viewBox="0 0 24 24" className={props.className ? props.className : 'svg-icon'}>
    <title>{props.title}</title>
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
  </svg>
}

export function BackIcon(props) {
  return <svg viewBox="0 0 24 24" className={props.className ? props.className : 'svg-icon'}>
    <title>{props.title}</title>
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
  </svg>
}

export function ForwardIcon(props) {
  return <svg viewBox="0 0 24 24" className={props.className ? props.className : 'svg-icon'}>
    <title>{props.title}</title>
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
  </svg>
}

export function SaveIcon(props) {
  return <svg viewBox="0 0 24 24" className={props.className ? props.className : 'svg-icon'}>
    <title>{props.title}</title>
    <path d="M0 0h24v24H0z" fill="none"></path>
    <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"></path>
  </svg>
}

export function SearchIcon(props) {
  return <svg viewBox="0 0 24 24" className={props.className ? props.className : 'svg-icon'}>
    <title>{props.title}</title>
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
    <path d="M0 0h24v24H0z" fill="none"/>
  </svg>
}

//<svg><use xlinkHref="./dist/symbols.svg#list"><title>Show Note List</title></use></svg>

/*
export function Icon(props) {
  return <svg viewBox="0 0 24 24" className={props.className ? props.className : 'svg-icon'}>
    <title>{props.title}</title>
  </svg>
}

export function Icon(props) {
  return <svg viewBox="0 0 24 24">
    <title>{props.title}</title>
  </svg>
}
*/

