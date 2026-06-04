'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import emailjs from '@emailjs/browser';
import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion';
import { MODAL_SCROLL_ROOT_ATTR } from '../shared/modal/constants';
import { useModalLayerLock } from '../shared/modal/useModalLayerLock';
import styles from './ContactModal.module.css';

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

type SubmitState = 'idle' | 'sending' | 'success' | 'error';

type ContactModalProps = {
  open: boolean;
  onClose: () => void;
};

const PLACEHOLDER_PATTERN = /^your_/i;

function getEmailJsConfig() {
  return {
    serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? '',
    templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? '',
    publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? '',
  };
}

function isPlaceholderValue(value: string) {
  return !value || PLACEHOLDER_PATTERN.test(value);
}

export default function ContactModal({ open, onClose }: ContactModalProps) {
  const reduceMotion = useReducedMotion();
  const titleId = useId();
  const descId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [mounted, setMounted] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [feedback, setFeedback] = useState('');

  useModalLayerLock(open);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      setSubmitState('idle');
      setFeedback('');
    }
  }, [open]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape' && submitState !== 'sending') {
        onClose();
      }
    },
    [onClose, submitState],
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    document.addEventListener('keydown', handleKeyDown);
    closeRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, handleKeyDown]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = formRef.current;
    if (!form) {
      return;
    }

    const honeypot = form.elements.namedItem('website') as HTMLInputElement | null;
    if (honeypot?.value) {
      return;
    }

    const { serviceId, templateId, publicKey } = getEmailJsConfig();
    if (
      !serviceId ||
      !templateId ||
      !publicKey ||
      isPlaceholderValue(serviceId) ||
      isPlaceholderValue(templateId) ||
      isPlaceholderValue(publicKey)
    ) {
      setSubmitState('error');
      setFeedback(
        'メール送信の設定が未完了です。.env.local に EmailJS の Service ID / Template ID / Public Key を設定してください。',
      );
      return;
    }

    setSubmitState('sending');
    setFeedback('');

    try {
      await emailjs.sendForm(serviceId, templateId, form, { publicKey });
      setSubmitState('success');
      setFeedback('送信しました。ご連絡ありがとうございます。');
      form.reset();
    } catch (error) {
      setSubmitState('error');
      const detail =
        error instanceof Error && error.message ? `（${error.message}）` : '';
      setFeedback(`送信に失敗しました。時間をおいて再度お試しください。${detail}`);
    }
  };

  const backdropMotion = reduceMotion
    ? { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 1 } }
    : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };

  const dialogMotion = reduceMotion
    ? { initial: { opacity: 1, y: 0, scale: 1 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 1, y: 0, scale: 1 } }
    : {
        initial: { opacity: 0, y: 20, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 12, scale: 0.98 },
      };

  if (!mounted) {
    return null;
  }

  return createPortal(
    <LazyMotion features={domAnimation} strict>
      <AnimatePresence>
        {open ? (
          <m.div
            className={styles.backdrop}
            role="presentation"
            onClick={submitState === 'sending' ? undefined : onClose}
            {...backdropMotion}
            transition={{ duration: 0.22, ease: EASE_OUT }}
          >
            <m.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={descId}
              className={styles.dialog}
              onClick={(event) => event.stopPropagation()}
              {...dialogMotion}
              transition={{ duration: 0.32, ease: EASE_OUT }}
            >
              <button
                ref={closeRef}
                type="button"
                className={styles.close}
                onClick={onClose}
                disabled={submitState === 'sending'}
                aria-label="お問い合わせフォームを閉じる"
              >
                ×
              </button>

              <div className={styles.body} {...{ [MODAL_SCROLL_ROOT_ATTR]: '' }}>
                <p className={styles.eyebrow}>Get in touch</p>
                <h2 id={titleId} className={styles.title}>
                  Contact
                </h2>
                <p id={descId} className={styles.lead}>
                  お仕事のご相談・技術的なご質問など、お気軽にご連絡ください。
                </p>

                <form
                  ref={formRef}
                  className={styles.form}
                  onSubmit={(event) => void handleSubmit(event)}
                  noValidate={false}
                >
                  <div className={styles.honeypot} aria-hidden="true">
                    <label htmlFor="contact-website">Website</label>
                    <input id="contact-website" type="text" name="website" tabIndex={-1} autoComplete="off" />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="contact-name">
                      お名前
                    </label>
                    <input
                      id="contact-name"
                      className={styles.input}
                      type="text"
                      name="from_name"
                      autoComplete="name"
                      required
                      disabled={submitState === 'sending'}
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="contact-email">
                      メールアドレス
                    </label>
                    <input
                      id="contact-email"
                      className={styles.input}
                      type="email"
                      name="from_email"
                      autoComplete="email"
                      required
                      disabled={submitState === 'sending'}
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="contact-subject">
                      件名
                    </label>
                    <input
                      id="contact-subject"
                      className={styles.input}
                      type="text"
                      name="subject"
                      required
                      disabled={submitState === 'sending'}
                    />
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="contact-message">
                      本文
                    </label>
                    <textarea
                      id="contact-message"
                      className={styles.textarea}
                      name="message"
                      required
                      disabled={submitState === 'sending'}
                    />
                  </div>

                  {feedback ? (
                    <p
                      className={`${styles.feedback} ${
                        submitState === 'success' ? styles.feedbackSuccess : styles.feedbackError
                      }`}
                      role="status"
                      aria-live="polite"
                    >
                      {feedback}
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    className={styles.submit}
                    disabled={submitState === 'sending' || submitState === 'success'}
                  >
                    {submitState === 'sending' ? '送信中…' : '送信する'}
                  </button>
                </form>
              </div>
            </m.div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </LazyMotion>,
    document.body,
  );
}
