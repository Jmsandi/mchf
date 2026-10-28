import {boardMembers} from './board';
import {reviewImages} from './review-images';
import {retiredImageReplacements, stockImages} from './stock-images';
import {originalPageSummaries} from './page-catalog';
import {sierraLeoneSummaries} from './sierra-leone';
import type {ContentRecord} from './content';

const imageUpdates = [
  ['programme-rmnch', '/images/hero.jpg', reviewImages.newborn],
  ['programme-health-systems', '/images/health-worker.jpg', reviewImages.healthSystems],
  ['programme-community-health', '/images/mother-child.jpg', reviewImages.community],
  ['programme-research-innovation', '/images/health-worker.jpg', reviewImages.evidence],
  ['resource-community-ownership', '/images/mother-child.jpg', stockImages.communityLearning],
  ['resource-evidence-to-action', '/images/health-worker.jpg', stockImages.evidenceStory],
  ['programme-health-systems', '/images/sierra-leone/kenema-health-worker-transport.jpg', stockImages.healthSystems],
  ['guide-immunization', '/images/sierra-leone/rural-health-promotion.jpg', stockImages.preventionLearning],
  ['guide-community-health', '/images/sierra-leone/community-theatre-mile-91.jpg', stockImages.participation],
  ['guide-research-innovation', '/images/sierra-leone/koidu-health-workers.jpg', stockImages.researchLearning],
  ['guide-health-systems', '/images/sierra-leone/koidu-newborn-care.jpg', stockImages.systemsLearning],
  ['resource-community-ownership', '/images/sierra-leone/community-dialogue.jpg', stockImages.communityLearning],
  ['resource-evidence-to-action', '/images/sierra-leone/port-loko-laboratory.jpg', stockImages.evidenceStory],
  ['resource-sustainable-systems', '/images/hero.jpg', stockImages.partnerships],
] as const;

/** Update superseded baseline fields in saved records while preserving staff edits and publication state. */
export function applyReviewDefaults(record: ContentRecord): ContentRecord {
  let result = {...record, meta: {...record.meta}};
  if (result.kind === 'page' && result.summary === originalPageSummaries[result.slug] && sierraLeoneSummaries[result.slug]) {
    result.summary = sierraLeoneSummaries[result.slug];
  }
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
  const replacement = Object.hasOwn(retiredImageReplacements, result.image) ? retiredImageReplacements[result.image] : undefined;
  if (replacement) {
    result = {...result, image: replacement.image, meta: {
      ...result.meta,
      alt: replacement.alt,
      imageCaption: replacement.caption,
    }};
  }
  const update = imageUpdates.find(([id, previousImage]) => result.id === id && result.image === (retiredImageReplacements[previousImage]?.image || previousImage));
  if (update) {
    const asset = update[2];
    result = {...result, image: asset.image, meta: {...result.meta, alt: asset.alt, imageCaption: asset.caption}};
  }
  return result;
}
