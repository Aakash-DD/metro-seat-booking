import { NavigatedData, Page } from '@nativescript/core';
import { OfferSeatViewModel } from './offer-seat-view-model';

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    page.bindingContext = new OfferSeatViewModel();
}