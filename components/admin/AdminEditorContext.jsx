"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import adminApi from '@/lib/adminApi';
import { useSetSiteText } from '@/components/SiteTextsProvider';

const AdminEditorContext = createContext({
  isAdmin: false,
  page: 'Home',
  editMode: true,
  setEditMode: () => {},
  openTextEdit: () => {},
  openMediaEdit: () => {},
  drawerOpen: false,
  setDrawerOpen: () => {},
  busyKey: null,
  toast: null,
});

export function AdminEditorProvider({ children, page = 'Home' }) {
  const [editMode, setEditMode] = useState(true);
  const [textModal, setTextModal] = useState(null); // { open, key, label, currentText, defaultText, type, section }
  const [mediaModal, setMediaModal] = useState(null); // { open, slotKey, label, currentMedia, defaultSrc }
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [busyKey, setBusyKey] = useState(null);
  const [toast, setToast] = useState(null);

  const setTextOverride = useSetSiteText();

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current));
    }, 3500);
  };

  const openTextEdit = (key, label, defaultText = '', type = 'text', section = '') => {
    setTextModal({
      open: true,
      key,
      label,
      defaultText,
      type,
      section,
    });
  };

  const closeTextEdit = () => setTextModal(null);

  const saveText = async (key, value, section = '') => {
    setBusyKey(key);
    try {
      await adminApi.post('/site-texts', {
        key,
        value,
        page,
        section,
      });
      setTextOverride(key, value);
      showToast('success', 'Text updated successfully.');
      closeTextEdit();
    } catch (err) {
      console.error('Failed to save text:', err);
      showToast('error', 'Failed to save text. Please try again.');
    } finally {
      setBusyKey(null);
    }
  };

  const resetText = async (key, defaultText) => {
    setBusyKey(key);
    try {
      await adminApi.delete(`/site-texts?key=${encodeURIComponent(key)}`);
      setTextOverride(key, null); // Reverts to fallback
      showToast('success', 'Reset to default text.');
      closeTextEdit();
    } catch (err) {
      console.error('Failed to reset text:', err);
      showToast('error', 'Failed to reset text.');
    } finally {
      setBusyKey(null);
    }
  };

  const openMediaEdit = (slotKey, label, defaultSrc = '') => {
    setMediaModal({
      open: true,
      slotKey,
      label,
      defaultSrc,
    });
  };

  const closeMediaEdit = () => setMediaModal(null);

  const uploadMedia = async (slotKey, file) => {
    if (!file) return;

    const isStorySlot = slotKey === 'home-story';
    const isVideo = file.type === 'video/mp4';

    if (isVideo && !isStorySlot) {
      showToast('error', 'Videos are only supported for Our Story section.');
      return;
    }
    if (isVideo && file.size > 100 * 1024 * 1024) {
      showToast('error', 'MP4 videos must be 100 MB or smaller.');
      return;
    }
    if ((!isVideo && !file.type.startsWith('image/')) || (isStorySlot && file.type.startsWith('video/') && !isVideo)) {
      showToast('error', isStorySlot ? 'Please select an image or MP4 video.' : 'Please select an image file.');
      return;
    }

    setBusyKey(slotKey);
    try {
      const { data } = await adminApi.post('/site-images', {
        action: 'get-upload-url',
        key: slotKey,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      });

      await fetch(data.signedUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      const mediaType = isVideo ? 'video' : 'image';
      await adminApi.post('/site-images', {
        key: slotKey,
        imageUrl: data.publicUrl,
        mediaType,
      });

      showToast('success', isVideo ? 'Video updated successfully.' : 'Image updated successfully.');
      closeMediaEdit();
      // Reload window or trigger site media re-fetch
      setTimeout(() => {
        window.location.reload();
      }, 700);
    } catch (err) {
      console.error('Media upload failed:', err);
      showToast('error', 'Media upload failed. Please try again.');
    } finally {
      setBusyKey(null);
    }
  };

  const resetMedia = async (slotKey) => {
    setBusyKey(slotKey);
    try {
      await adminApi.delete(`/site-images?key=${encodeURIComponent(slotKey)}`);
      showToast('success', 'Reset to default media.');
      closeMediaEdit();
      setTimeout(() => {
        window.location.reload();
      }, 700);
    } catch (err) {
      console.error('Media reset failed:', err);
      showToast('error', 'Failed to reset media.');
    } finally {
      setBusyKey(null);
    }
  };

  return (
    <AdminEditorContext.Provider
      value={{
        isAdmin: true,
        page,
        editMode,
        setEditMode,
        openTextEdit,
        closeTextEdit,
        textModal,
        saveText,
        resetText,
        openMediaEdit,
        closeMediaEdit,
        mediaModal,
        uploadMedia,
        resetMedia,
        drawerOpen,
        setDrawerOpen,
        busyKey,
        toast,
        showToast,
      }}
    >
      {children}
    </AdminEditorContext.Provider>
  );
}

export function useAdminEditor() {
  return useContext(AdminEditorContext);
}

