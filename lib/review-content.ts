import {boardMembers} from './board';
import {reviewImages} from './review-images';
import type {ContentRecord} from './content';

const imageUpdates = [
  ['programme-rmnch', '/images/hero.jpg', reviewImages.newborn],
  ['programme-health-systems', '/images/health-worker.jpg', reviewImages.healthSystems],
  ['programme-community-health', '/images/mother-child.jpg', reviewImages.community],
  ['programme-research-innovation', '/images/health-worker.jpg', reviewImages.evidence],
  ['resource-community-ownership', '/images/mother-child.jpg', reviewImages.community],
  ['resource-evidence-to-action', '/images/health-worker.jpg', reviewImages.evidence],
] as const;

/** Update superseded baseline fields in saved records while preserving staff edits and publication state. */
export function applyReviewDefaults(record: ContentRecord): ContentRecord {
  let result = {...record, meta: {...record.meta}};
  const member = boardMembers.find(member => member.id === record.id && record.kind === 'leadership');
  if (member) {
    if (member.previousName && result.title === member.previousName) {
      result.title = member.name;
      result.body = result.body.replaceAll(member.previousName, member.name);
      if (result.meta.alt === 'Portrait of ' + member.previousName) result.meta.alt = 'Portrait of ' + member.name;
    }
    if (member.legacySlug && result.slug === member.legacySlug) result.slug = member.slug;
    if (!Object.hasOwn(result.meta, 'portfolioSummary')) result.meta.portfolioSummary = member.portfolioSummary;
  }
  const update = imageUpdates.find(([id, previousImage]) => result.id === id && result.image === previousImage);
  if (update) {
    const asset = update[2];
    result = {...result, image: asset.image, meta: {...result.meta, alt: asset.alt, imageCaption: asset.caption}};
  }
  return result;
}
