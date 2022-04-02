import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsModalsComponent } from './news-modals.component';

describe('NewsModalsComponent', () => {
  let component: NewsModalsComponent;
  let fixture: ComponentFixture<NewsModalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewsModalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsModalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
