import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogDialogComponent } from '../blog/blog-dialog.component';

describe('BlogDialogComponent', () => {
  let component: BlogDialogComponent;
  let fixture: ComponentFixture<BlogDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlogDialogComponent]
    });
    fixture = TestBed.createComponent(BlogDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
